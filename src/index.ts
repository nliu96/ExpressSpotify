import app from './App'
import * as cors from 'cors'
// TODO: only require dotenv in production
import dotenv from 'dotenv'
require('dotenv').config()

const port = process.env.PORT || 3001

app.use(cors())

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
