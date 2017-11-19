const express = require('express')
const app = express()

require('dotenv').config()

app.get('/', (req, res) => res.send(process.env.CLIENT_ID))

app.listen(3001, () => console.log('Example app listening on port 3001!'))