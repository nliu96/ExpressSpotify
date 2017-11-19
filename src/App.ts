import * as express from 'express'
import * as request from 'request'

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => res.send('Hello world!'))

    router.get('/search', (req, res) => {
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

    router.get('/artists', (req, res) => {
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


    this.express.use('/', router)
  }
}

export default new App().express
