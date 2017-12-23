const express = require('express');
const request = require('request');

const app = express();

app.set('port', (process.env.API_PORT || 3001));

app.get('/api/info', (req, res) => {
  res.json({"hello": "Hello World!"})
});

app.get('/api/recareas', (req, res) => {
  const param = req.query.state;

  if (!param) {
    res.json({
      error: 'Missing required parameter `state`',
    });
    return;
  }

  request(`https://ridb.recreation.gov/api/v1/recareas.json?apikey=5722E187D51D46678DC8F5B047FCB82E&full=true&state=${param}`, function (error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    res.json(JSON.parse(body));
  });

});


// app.get('/api/food', (req, res) => {
//   const param = req.query.q;

//   if (!param) {
//     res.json({
//       error: 'Missing required parameter `q`',
//     });
//     return;
//   }

//   // WARNING: Not for production use! The following statement
//   // is not protected against SQL injections.
//   const r = db.exec(`
//     select ${COLUMNS.join(', ')} from entries
//     where description like '%${param}%'
//     limit 100
//   `);

//   if (r[0]) {
//     res.json(
//       r[0].values.map((entry) => {
//         const e = {};
//         COLUMNS.forEach((c, idx) => {
//           // combine fat columns
//           if (c.match(/^fa_/)) {
//             e.fat_g = e.fat_g || 0.0;
//             e.fat_g = parseFloat((
//               parseFloat(e.fat_g, 10) + parseFloat(entry[idx], 10)
//             ).toFixed(2), 10);
//           } else {
//             e[c] = entry[idx];
//           }
//         });
//         return e;
//       }),
//     );
//   } else {
//     res.json([]);
//   }
// });

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
