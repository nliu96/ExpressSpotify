import { Router } from 'express'
import axiosLib from 'axios'
import * as qs from 'querystring'
import db from '../db'
import { handleError } from '../utils'

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
    }).then((response) => {
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

const router = Router()

router.get('/handleSignIn', (req, res) => {
  // exchange req.query.code for an access token using an endpoint
  let access_token
  axios.get(url('oauth/access_token'), {
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      redirect_uri: 'http://localhost:3001/handleSignIn',
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      code: req.query.code,
    }
  }).then((response) => {
    // exchange short-lived access token for long-lived access token
    return axios.get(url('oauth/access_token'), {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET,
        grant_type: 'fb_exchange_token',
        fb_exchange_token: response.data.access_token
      }
    })
  }).then((response) => {
    // verify token is valid
    access_token = response.data.access_token
    return axios.get(url('debug_token'), {
      params: {
        input_token: access_token
      }
    })
  }).then((response) => {
    if (response.data.data.is_valid) {
      //store access token in database with user id
      return store(response.data.data.user_id, access_token)
    }
    throw new Error("Access token invalid.")
  }).then((id) => res.send(id)
  ).catch((err) => handleError(err, res))
})

router.get('/signIn', (req, res) => {
  res.redirect(`https://www.facebook.com/v2.11/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${thisUrl}/handleSignIn`)
})

const url = (endpoint) => `https://graph.facebook.com/v2.11/${endpoint}`

// TODO: handle new url in production
const thisUrl = 'http://localhost:3001'

export default router

