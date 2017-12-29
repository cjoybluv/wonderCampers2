const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const async = require('async');
const geocoder = require('geocoder');
const bcrypt = require('bcrypt');

const stitch = require("mongodb-stitch");
const client = new stitch.StitchClient('wondercampers-hdghh');
const db = client.service('mongodb', 'mongodb-atlas').db('wonderCampers');

const app = express();

app.set('port', (process.env.API_PORT || 3001));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Accept');
  next();
});

const jsonParser = bodyParser.json();

app.get('/api/info', (req, res) => {
  res.json({"hello": "Hello World!"})
});

app.get('/api/recareas', (req, res) => {
   var state = req.query.state;
   var pageOffset = 0;
   var activity = req.query.activity;
   var outOfData = false;
   var myData = [];
   var totalCount = 0;

   async.until(
       function () { return (outOfData); },
       function (callback) {
         request({
           url:'https://ridb.recreation.gov/api/v1/recareas.json',
           qs:{
             apikey:'5722E187D51D46678DC8F5B047FCB82E',
             state: state,
             offset: pageOffset*50,
             full:true
           }
         },function(error,response,body) {
           pageOffset++;
           if(!error && response.statusCode === 200) {
             myData = myData.concat(JSON.parse(body).RECDATA);
             totalCount = JSON.parse(body).METADATA.RESULTS.TOTAL_COUNT;
             if (myData.length >= totalCount) {
               outOfData = true;
             }
             callback(null);
           } else {
             res.json({
               error:error,
               code:response.statusCode
             });
           }

         });
       },
       function (err) {
           myData.sort(sortRecareas);
           res.json(myData);
       }
   );
});

app.get('/api/facilities', (req, res) => {
  var facilityIDs = req.query.facilityIDs ? req.query.facilityIDs.split(',') : null;
  var state = req.query.state;
  var query = req.query.query;
  var radius = req.query.radius;
  var placeName = req.query.placeName;
  var myData = [];
  var rqstParam = {};
  console.log('FETCH FACILITIES:',facilityIDs,state,query,radius,placeName);

  if (!facilityIDs && !query && !radius) {
    return false;
  }
  if (facilityIDs) {
    async.each(facilityIDs, function(facilityID, callback) {

      request({
        url:'https://ridb.recreation.gov/api/v1/facilities/'+facilityID.toString(),
        qs:{
            apikey:'5722E187D51D46678DC8F5B047FCB82E',
            full:true
        }
      },function(error,response,body) {
            if(!error && response.statusCode === 200) {
              myData.push(JSON.parse(body));
            } else {
              callback('error: RidbController,FacilityID request');
              // res.send({
              //   error:error,
              //   code:response.statusCode
              // });
            }
            callback();
          },function (err) {
              myData.sort(sortFacilities);
              res.send(myData);
      });
    }, function(err){
        if( err ) {
          console.log('ERR: RidbController,Async.FacilityIDs',err);
        } else {
          myData.sort(sortFacilities);
          res.send(myData);
        }
    });


  }
  if (query && state) {
    console.log('FACILITIES by State / Query:',state,query);
    var outOfData = false;
    var pageOffset = 0;
    var totalCount = 0;

    async.until(
      function () { return (outOfData); },
      function (callback) {
        request({
          url:'https://ridb.recreation.gov/api/v1/facilities.json',
          qs:{
            apikey:'5722E187D51D46678DC8F5B047FCB82E',
            state: state,
            query: query,
            offset: pageOffset*50,
            full:true
          }
        },function(error,response,body) {
          pageOffset++;
          if(!error && response.statusCode === 200) {
            myData = myData.concat(JSON.parse(body).RECDATA);
            totalCount = JSON.parse(body).METADATA.RESULTS.TOTAL_COUNT;
            if (myData.length >= totalCount) {
              outOfData = true;
            }
            // setTimeout(callback, 5);
            callback(null);
          } else {
            res.send({
              error:error,
              code:response.statusCode
            });
          }

        });
      },
      function (err) {
          myData.sort(sortFacilities);
          res.send(myData);
      }
    );

  }

  if(state && radius && placeName) {
    console.log('FACILITIES by State / Radius / Placename:',state,radius,placeName);
    var coord = {};
    geocoder.geocode(placeName+", "+state, function ( err, data ) {
      if(typeof data.results[0] != 'undefined') {
        coord.lat = data.results[0].geometry.location.lat;
        coord.lng = data.results[0].geometry.location.lng;
      }
      console.log('-- GeoCoord',JSON.stringify(coord));

      var outOfData = false;
      var pageOffset = 0;
      var totalCount = 0;

      async.until(
        function () { return (outOfData); },
        function (callback) {
          request({
            url:'https://ridb.recreation.gov/api/v1/facilities.json',
            qs:{
              apikey:'5722E187D51D46678DC8F5B047FCB82E',
              state: state,
              latitude: coord.lat,
              longitude: coord.lng,
              radius: radius,
              offset: pageOffset*50,
              full:true
            }
          },function(error,response,body) {
            pageOffset++;
            if(!error && response.statusCode === 200) {
              myData = myData.concat(JSON.parse(body).RECDATA);
              totalCount = JSON.parse(body).METADATA.RESULTS.TOTAL_COUNT;
              if (myData.length >= totalCount) {
                outOfData = true;
              }
              // setTimeout(callback, 5);
              callback(null);
            } else {
              res.send({
                error:error,
                code:response.statusCode
              });
            }

          });
        },
        function (err) {
          myData.sort(sortFacilities);
          res.send(myData);
        }
      );

    }); // geocoder
  }
});


app.post('/api/signup', jsonParser, (req,res) => {
  console.log('SIGNUP REQUEST',req.body);
  const { firstName, lastName, email, password } = req.body;
  const users = db.collection('users');
  
  try {
    client.login().then(() => {
      // bcrypt.hash(values.password,10,function(err,hash){
      bcrypt.hash(password,10,(err, hash) => {
        const user = {firstName, lastName, email, password: hash};
          users.updateOne(
            { "email" : email },
            { $set: user },
            { upsert: true }
          ).then((response) => {
            users.find({_id: response.upsertedId}, null).execute().then(function(user) {
              console.log('SIGNUP SUCCESS',response.upsertedId);
              res.send(user[0]);
            });
          })
      });
    }).catch(err => {
      console.error('SIGNUP ERROR:',err);
      res.send({error: err});
    });
  } catch (e) {
    console.error('CLIENT LOGIN ERROR:',e);
  }
});

app.post('/api/login', jsonParser, (req, res) => {
  console.log('LOGIN REQUEST', req.body);
  const { email, password } = req.body;
  const users = db.collection('users');

  try {
    client.login().then(() => {
      users.find({email: email}, null).execute().then((user) => {
        // bcrypt.compare(req.body.password, user.password, function(err, result){
        bcrypt.compare(password, user[0].password, (err, result) => {

          if(err) return res.send({result:false, error: err});
          if(result){
            console.log('LOGIN SUCCESS',user[0]);
            res.send(user[0]);
          }else{
            res.send({
              result:false,
              error: 'Invalid Password.'
            });
          }

        });
      });
    });
  } catch (e) {
    console.error('CLIENT LOGIN ERROR',e);
  }
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});


function sortRecareas(a,b) {
  if (a.RecAreaName < b.RecAreaName)
    return -1;
  if (a.RecAreaName > b.RecAreaName)
    return 1;
  return 0;
}

function sortFacilities(a,b) {
  if (a.FacilityName < b.FacilityName)
    return -1;
  if (a.FacilityName > b.FacilityName)
    return 1;
  return 0;
}
