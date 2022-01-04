import app from './server'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { error } from './utils/debug'
import initDB from './db'
import initRedis from './redis/init'
import { start } from './utils/debug'
import sockets from './sockets'
import { createAdapter } from '@socket.io/redis-adapter'

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
  if (!process.env.COOLDOWN) {
    process.env.COOLDOWN = 100
  }

  const redisClient = await initRedis()
  await initDB({ pixelSeed: process.env.PIXEL_SEED })

  const port = process.env.PORT || 4000

  const httpServer = createServer(app)

  const io = new Server(httpServer, { cors: { origin: '*' } })
  const pubClient = redisClient
  // pubClient.on('error', (err) => error('Redis Client Error', err))
  const subClient = pubClient.duplicate()
  io.on('error', (args) => {
    error(...args)
  })

  io.adapter(createAdapter(pubClient, subClient))
  sockets(io)

  httpServer.listen(port, () => {
    start('rest API is listening to port %d', port)
  })
})()
