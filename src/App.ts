import * as express from 'express'
import axios from 'axios'
import * as qs from 'querystring'

axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`

// Gets/refreshes token using client id and secret anytime a 401 response is returned
axios.interceptors.response.use((response) => response, ({ config, response }) => {
  if (config && response && response.status === 401) {
    return axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'client_credentials',
    }), {
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }).then(({ data }) => {
      process.env.ACCESS_TOKEN = data.access_token
      config.headers['Authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`
      return axios.request(config)
    })
  }
  return Promise.reject(response)
})

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => res.send('Hello world!'))

    // Given an artist name, return spotify ID
    router.get('/search', (req, res) => {
      const params = Object.assign(req.query, { type: 'artist' })
      axios.get('https://api.spotify.com/v1/search', { params })
        .then(({ data }) => {
          res.send(data.artists.items.map(({ followers, genres, id, images, name, popularity }) => {
            return { followers: followers.total, genres, id, images, name, popularity }
          }))
        })
        .catch((err) => res.send(handleError(err)))
    })
  
    // Given a spotify ID, gets information about the artist
    router.get('/artist/:id', (req, res) => {
      axios.get(`https://api.spotify.com/v1/artists/${req.params.id}`, { params: req.query })
        .then(({ data }) => {
          const { followers, genres, id, images, name, popularity } = data
          res.send({ followers: followers.total, genres, id, images, name, popularity })
        })
        .catch((err) => res.send(handleError(err)))
    })

    this.express.use('/', router)
  }
}

const handleError = (err) => err && err.data ? err.data.error.message : err

export default new App().express
