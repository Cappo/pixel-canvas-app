import { log } from '../utils/debug'
import { updatePixel } from '../services/pixel'
import { getLastPaintstroke, createPaintstroke } from '../services/paintstroke'
import { getPixelCache, setPixelCache } from '../redis/pixels'

const pixelHandler = (io, socket) => {
  socket.on('change', async (message, cb) => {
    // check if user is on cooldown
    const lastPaintstroke = await getLastPaintstroke(socket.user)
    if (
      lastPaintstroke !== null &&
      Date.now() - new Date(lastPaintstroke.createdAt).getTime() <
        process.env.COOLDOWN
    ) {
      cb({ status: 'cooldown' })
    } else {
      log('change', message)
      log('user', socket.user)
      const { canvasId, index, color } = message
      if (!canvasId || !index || !color) {
        cb({ status: 'error', error: 'Malformed message' })
      }
      const buffer = Buffer.from(color.slice(1), 'hex')
      Promise.all([
        updatePixel(canvasId, index, Array.from(buffer)),
        setPixelCache(canvasId, index, buffer),
        createPaintstroke(canvasId, index, socket.user),
      ])
        .then(() => {
          cb({ status: 'ok' })
          socket.to(canvasId).emit('change', message)
        })
        .catch((e) => {
          cb({ status: 'error', error: e.message })
        })
    }
  })

  socket.on('init', async (cb) => {
    log('init')
    log(socket.rooms)
    const [, canvas] = socket.rooms
    const data = await getPixelCache(canvas)
    cb({ buffer: data })
  })
}

export default pixelHandler
