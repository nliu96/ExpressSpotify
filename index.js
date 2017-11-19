const express = require('express');
const request = require('request');
const app = express();

require('dotenv').config()

app.get('/', (req, res) => res.send('Hello world!'))

app.get('/search', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/search',
    qs: req.query,
    headers: { 'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN },
    json: true
  };

  request.get(options, (error, response, body) => {
    if(!error) {
      return res.send(body);
    } else {
      console.log(error);
    }
  });
})

app.get('/artists', (req, res) => {
  var options = {
    url: 'https://api.spotify.com/v1/artists/' + req.query.id,
    headers: { 'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN },
    json: true
  };

  request.get(options, (error, response, body) => {
    if(!error) {
      return res.send(body);
    } else {
      console.log(error);
    }
  });
})

app.listen(3001, () => console.log('App listening on port 3001!'))