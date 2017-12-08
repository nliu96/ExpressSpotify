import * as express from 'express'
import axios from 'axios'
import * as qs from 'querystring'
import * as cors from 'cors'

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
    }).catch((err) => console.log(err))
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

    router.use(cors())

    router.get('/', (req, res) => res.send('Hello world!'))

    // Given an artist name, return spotify ID
    router.get('/search', (req, res) => {
      const params = Object.assign(req.query, { type: 'artist' })
      axios.get(url('search'), { params })
        .then(({ data }) => {
          res.send(data.artists.items.map(({ followers, genres, id, images, name, popularity }) => {
            return { followers: followers.total, genres, id, images, name, popularity }
          }))
        })
        .catch((err) => handleError(err, res))
    })

    // Given a spotify ID, gets information about the artist and target price
    router.get('/artist/:id', (req, res) => {
      axios.get(url(`artists/${req.params.id}`), { params: req.query })
        .then(({ data }) => {
          const { followers, genres, id, images, name, popularity } = data
          const shares = 10000
          let value = followers.total * (popularity / 100) 
          let price = (value + Math.random() * 0.05 * followers.total) / shares
          res.send({ followers: followers.total, genres, id, images, name, popularity, price })
        })
        .catch((err) => handleError(err, res))
    })

    // gets updated price that strives towards target price 
    router.get('/update/:id', (req, res) => {
        res.send({ name:"Jay Devanathan owns 90% of this company. Joe potentially could own 10%. Everyone else has options once we go public" })
    })


    // Return information on popular and trending artists
    router.get('/browse', (req, res) => {
      // Link for spotify global top 50 playlist
      axios.get(url('users/spotifycharts/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks'))
        .then(({ data }) => {
          const artistImages = {}
          const artistRanks = data.items.reduce((acc, item) => {
            const image = item.track.album.images[1].url
            item.track.artists.forEach(({ name }, i) => {
              const rank = 50 - i
              artistImages[name] = image
              if (acc[name]) {
                // discount repeat top artists by 2
                acc[name] += rank / 2
              } else {
                acc[name] = rank
              }
            })
            return acc
          }, {})
          const artistsByRank = Object.keys(artistRanks).sort((a, b) => artistRanks[b] - artistRanks[a])
          const popular = artistsByRank.map((artist) => ({
            image: artistImages[artist],
            name: artist,
          }))
          res.send({ popular })
        })
        .catch((err) => handleError(err, res))
    })

    router.get('/register', (req, res) => {
      // exchange req.query.code for an access token using an endpoint
      console.log(req.query)
      axios.get('https://graph.facebook.com/v2.11/oauth/access_token', {
        params: {
          client_id: process.env.FACEBOOK_ID,
          redirect_uri: 'http://localhost:3001/register',
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          code: req.query.code
        }
      })
      .then(function (response) {
        console.log(response.data.access_token)
      })
      .catch(function (err) {
        console.log(err.data)
      })
      /*
      //axios.get('https://graph.facebook.com/v2.11/oauth/access_token', {
      // res.redirect('https://www.facebook.com/v2.11/dialog/oauth?client_id=1745819622156281&redirect_uri=http://localhost:3001/login')
      // get an app access token (not sure if once or each time)
			GET /oauth/access_token
					?client_id={app-id}
					&client_secret={app-secret}
					&grant_type=client_credentials
      // verify token once received via inspection endpoint, check app_id and user_id
      GET graph.facebook.com/debug_token?
        input_token={token-to-inspect}
        &access_token={app-token-or-admin-token} 
      // store access token in database 
      // look at postgres code Joe wrote for cow
      console.log(req.query.code)
      */
      res.send({ name:"Jay Devanathan owns 90% of this company. Joe potentially could own 10%. Everyone else has options once we go public" })
    })

    // TODO: make another endpoint for login 
    router.get('/login', (req, res) => {
      res.send({ name:"Jay Devanathan owns 90% of this company. Joe potentially could own 10%. Everyone else has options once we go public" })
    })

    // TODO: remove before commit
    router.get('/registertest', (req, res) => {
      res.redirect('https://www.facebook.com/v2.11/dialog/oauth?client_id=1745819622156281&redirect_uri=http://localhost:3001/register')
    })

    // TODO: remove before commit
    router.get('/logintest', (req, res) => {
      res.redirect('https://www.facebook.com/v2.11/dialog/oauth?client_id=1745819622156281&redirect_uri=http://localhost:3001/login&response_type=token&state=123')
    })

    this.express.use('/', router)
  }
}

const url = (endpoint) => `https://api.spotify.com/v1/${endpoint}`

const handleError = (err, res) => {
  if (err && err.data) {
    const { status, message } = err.data.error
    res.status(status).send(message)
  } else if (typeof err === 'object') {
    res.status(500).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
  } else {
    res.status(500).send(err)
  }
}

export default new App().express
