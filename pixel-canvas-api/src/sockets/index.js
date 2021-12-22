import { sockets } from '../utils/debug'
import authMiddleware from './authMiddleware'
import registerUserHandler from './userHandler'
import registerPixelHandler from './pixelHandler'

const init = (io) => {
  io.use(authMiddleware)

  io.sockets.on('connection', (socket) => {
    sockets('connection')

    registerUserHandler(io, socket)
    registerPixelHandler(io, socket)

    socket.on('disconnect', () => {
      sockets('disconnect')
    })
  })
}

export default init
