import app from './index'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { start } from './utils/debug'
import sockets from './sockets'

const port = process.env.PORT || 4000

const httpServer = createServer(app)

const io = new Server(httpServer, { cors: { origin: '*' } })
sockets(io)

httpServer.listen(port, () => {
  start('rest API is listening to port %d', port)
})
