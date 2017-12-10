import * as express from 'express'
import * as cors from 'cors'
import axiosLib from 'axios'
import * as qs from 'querystring'
import routes from './routes'

class App {
  public express

  constructor () {
    this.express = express()

    this.express.use(cors())

    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.use(routes)
    this.express.use('/', router)
  }
}

export default new App().express
