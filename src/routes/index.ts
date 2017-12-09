import * as express from 'express'
import facebookRoutes from './facebook'
import spotifyRoutes from './spotify'

const router = express.Router()

router.get('/', (req, res) => res.send('Hello world!'))

router.use('/', facebookRoutes)
router.use('/', spotifyRoutes)

export default router
