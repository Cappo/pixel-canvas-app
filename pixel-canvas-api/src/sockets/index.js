import { sockets } from '../utils/debug'
import registerUserHandler from './userHandler'
import registerPixelHandler from './pixelHandler'

const init = (io) => {
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
