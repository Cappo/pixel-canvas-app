import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
// import { middleware as auth } from './auth/googleAuth'
import canvasRoutes from './routes/canvas'

const app = express()

app.use(compression())
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/health', (req, res) => {
  res.status(200).send('OK')
})
app.use('/env', (req, res) => {
  res.status(200).send({ host: process.env.HOSTNAME })
})
app.use('/canvas', /*auth, */ canvasRoutes)

export default app
