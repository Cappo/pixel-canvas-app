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
import { syncAllCanvases } from './redis/pixels'

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

  if (!process.env.COOLDOWN) {
    process.env.COOLDOWN = 100
  }

  const redisClient = await initRedis()
  await initDB()
  await syncAllCanvases()

  const httpServer = createServer(app)

  const io = new Server(httpServer, { cors: { origin: '*' } })
  io.on('error', (args) => {
    error(...args)
  })

  const pubClient = redisClient
  const subClient = pubClient.duplicate()
  io.adapter(createAdapter(pubClient, subClient))
  sockets(io)

  const port = process.env.PORT || 4000
  httpServer.listen(port, () => {
    start('rest API is listening to port %d', port)
  })
})()
