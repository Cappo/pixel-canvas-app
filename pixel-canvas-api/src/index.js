import express from 'express'
import dotenv from 'dotenv'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import { error } from './utils/debug'
import db from './db'
import redis from './redis/init'
import pixelRoutes from './routes/pixel'
import HttpStatus from 'http-status-codes'

if (process.env.NODE_ENV !== 'test') {
  const result = dotenv.config()

  if (result.error) {
    error('%O', result.error)
    throw result.error
  }

  process.env = {
    ...process.env,
    result,
  }
}

if (process.env.NODE_ENV !== 'test') {
  const pixelSeed =
    process.env.PIXEL_SEED === undefined ? undefined : process.env.PIXEL_SEED
  db({ pixelSeed })
  redis({ pixelSeed })
}
const app = express()

app.get('/health', (req, res) => {
  res.status(HttpStatus.OK).send('OK')
})

app.use(compression())
app.use(helmet())

app.use(express.json())
app.use(cors())

app.use('/pixels', pixelRoutes)

export default app
