import { log } from '../utils/debug'
import { updatePixel } from '../services/pixel'
import { getPixelCache, setPixelCache } from '../redis/pixels'

const pixelHandler = (io, socket) => {
  socket.on('change', async (message, cb) => {
    log('change', message)
    const { index, color } = message
    const buffer = Buffer.from(color.slice(1), 'hex')
    const successDB = await updatePixel(index, Array.from(buffer))
    const successR = await setPixelCache(index, buffer)
    if (successDB && successR) {
      cb({ status: 'ok' })
      socket.broadcast.emit('change', message)
    }
  })

  socket.on('init', async (cb) => {
    log('init')
    const data = await getPixelCache()
    cb({ buffer: data })
  })
}

export default pixelHandler
