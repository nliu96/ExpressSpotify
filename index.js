const express = require('express');
const request = require('request');
const qs = require('querystring');
const app = express();

require('dotenv').config()

app.get('/', (req, res) => res.send(process.env.CLIENT_ID))

app.get('/search', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/search',
    qs: { q:req.query.q, type:req.query.type },
    headers: { 'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN },
    json: true
  };
  var search = request.get(options, (error, response, body) => {
    if(!error) {
      return res.send(body);
    } else {
      console.log(error);
    }
  });
})

app.listen(3001, () => console.log('App listening on port 3001!'))