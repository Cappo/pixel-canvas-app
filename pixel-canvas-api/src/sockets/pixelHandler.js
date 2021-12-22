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
      const { index, color } = message
      const buffer = Buffer.from(color.slice(1), 'hex')
      Promise.all([
        updatePixel(index, Array.from(buffer)),
        setPixelCache(index, buffer),
        createPaintstroke(index, socket.user),
      ])
        .then(() => {
          cb({ status: 'ok' })
          socket.broadcast.emit('change', message)
        })
        .catch((e) => {
          cb({ status: 'error', error: e.message })
        })
    }
  })

  socket.on('init', async (cb) => {
    log('init')
    const data = await getPixelCache()
    cb({ buffer: data })
  })
}

export default pixelHandler
