import { log } from '../utils/debug'
import { updatePixel } from '../services/pixel'
import { getPixelCache, setPixelCache } from '../redis/pixels'

const pixelHandler = (io, socket) => {
  socket.on('change', async (message, cb) => {
    log('change', message)
    const { index, color } = message
    const successDB = await updatePixel(index, color)
    const intarray = Uint8ClampedArray.from(color)
    const buffer = Buffer.from(intarray)
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
