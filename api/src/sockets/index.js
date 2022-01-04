import { error, sockets } from '../utils/debug'
import authMiddleware from './authMiddleware'
import registerUserHandler from './userHandler'
import registerPixelHandler from './pixelHandler'

const init = (io) => {
  io.use(authMiddleware)

  io.sockets.on('connection', (socket) => {
    sockets('connection', socket.handshake.query)
    socket.join(socket.handshake.query.canvasId)

    registerUserHandler(io, socket)
    registerPixelHandler(io, socket)

    socket.on('disconnect', () => {
      sockets('disconnect')
    })
  })

  io.sockets.on('error', (args) => {
    error(...args)
  })
}

export default init
