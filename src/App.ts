import * as express from 'express'
import router from './routes'

class App {
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.send(process.env.CLIENT_ID)
    })
    this.express.use('/', router)
  }
}

export default new App().express
