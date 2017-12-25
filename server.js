const express = require('express');
const request = require('request');
const async = require('async');
const geocoder = require('geocoder');

const app = express();

app.set('port', (process.env.API_PORT || 3001));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  next();
});

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

  if(radius && placeName) {
    var coord = {};
    geocoder.geocode(placeName+", "+state, function ( err, data ) {
      if(typeof data.results[0] != 'undefined') {
        coord.lat = data.results[0].geometry.location.lat;
        coord.lng = data.results[0].geometry.location.lng;
      }

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
