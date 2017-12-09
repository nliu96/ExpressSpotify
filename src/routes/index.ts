import * as express from 'express'
import facebookRoutes from './facebook'

const router = express.Router()

router.use('/', facebookRoutes)

export default router
