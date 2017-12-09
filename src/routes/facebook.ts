import * as express from 'express'
import axiosLib from 'axios'
import * as qs from 'querystring'
import db from '../db'
import * as cors from 'cors'

const axios = axiosLib.create({
  headers: { Authorization: `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}` },
})

// Gets/refreshes token using client id and secret anytime a 401 response is returned
axios.interceptors.response.use((response) => response, ({ config, response }) => {
  if (config && response && response.status === 401) {
    return axios.get('https://graph.facebook.com/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }
    })
    .then((response) => {
      process.env.FACEBOOK_ACCESS_TOKEN = response.data.access_token
      config.headers['Authorization'] = `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`
      return axios.request(config)
    }).catch((err) => console.log(err))
  }
  return Promise.reject(response)
})


const store = (uid, token) => {
  return db.insertUser(uid, token)
}

const router = express.Router()

router.get('/register', (req, res) => {
  // exchange req.query.code for an access token using an endpoint
  let access_token
  axios.get('https://graph.facebook.com/v2.11/oauth/access_token', {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      redirect_uri: 'http://localhost:3001/register',
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      code: req.query.code,
    }
  })
  .then(function (response) {
    // exchange short-lived access token for long-lived access token
    return axios.get('https://graph.facebook.com/v2.11/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: response.data.access_token
      }
    })
  })
  .then(function (response) {
    //verify token is valid
    access_token = response.data.access_token
    return axios.get('https://graph.facebook.com/v2.11/debug_token', {
      params: {
        input_token: access_token
      }
    })
  })
  .then(function (response) {
    if (response.data.data.is_valid) {
      //store access token in database with user id
      return store(response.data.data.user_id, access_token)
    }
    throw new Error("Access token invalid.")
  })
    .then((id) => res.send(id))
  .catch(function (err) {
    console.log(Object.getOwnPropertyNames(err))
    console.log(err)
  })
  // redirect back to original URL (localhost:3000 for now)
  //res.send({ name:"Jay Devanathan owns 90% of this company. Joe potentially could own 10%. Everyone else has options once we go public" })
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

const homepage_url = "http://localhost:3000"

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

export default router

