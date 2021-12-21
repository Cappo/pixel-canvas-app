import app from './server'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { error } from './utils/debug'
import initDB from './db'
import initRedis from './redis/init'
import { start } from './utils/debug'
import sockets from './sockets'

// eslint-disable-next-line prettier/prettier
(async () => {
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

  if (!process.env.PIXEL_SEED) {
    process.env.PIXEL_SEED = 1000000
  }

  await initRedis()
  await initDB({ pixelSeed: process.env.PIXEL_SEED })

  const port = process.env.PORT || 4000

  const httpServer = createServer(app)

  const io = new Server(httpServer, { cors: { origin: '*' } })
  sockets(io)

  httpServer.listen(port, () => {
    start('rest API is listening to port %d', port)
  })
})()
