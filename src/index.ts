import app from './App'

// TODO: only require dotenv in production
import dotenv from 'dotenv'
require('dotenv').config()

const port = process.env.PORT || 3001

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})
