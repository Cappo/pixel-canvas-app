import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import redisRoutes from './routes/redis'
import pixelRoutes from './routes/pixel'

const app = express()

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

app.use(compression())
app.use(helmet())
app.use(cors())
app.use(express.json())

app.use('/pixels', pixelRoutes)
app.use('/redis', redisRoutes)

export default app
