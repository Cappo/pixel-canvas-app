import { log } from '../utils/debug'
import { updatePixel } from '../services/pixel'

const pixelHandler = (io, socket) => {
  socket.on('change', async (message, cb) => {
    log('change', message)
    const { index, color } = message
    const success = await updatePixel(index, color)
    if (success) {
      cb({ status: 'ok' })
      socket.broadcast.emit('change', message)
    }
  })
}

export default pixelHandler
