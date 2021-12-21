import { client } from './init'
import { error } from '../utils/debug'
import pixels from '../models/pixel'

export const getPixelCache = async () => {
  try {
    const data = await client.getBuffer('pixels')
    return data
  } catch (e) {
    error('failed to getPixelCache', e)
  }
}

export const setPixelCache = async (index, buffer) => {
  try {
    const offset = index * 4
    const resp = await client.setrangeBuffer('pixels', offset, buffer)
    return resp
  } catch (e) {
    error('failed to setPixelCache', e)
  }
}

export const syncPixelCacheWithDB = async () => {
  const cache = new Uint8ClampedArray(process.env.PIXEL_SEED * 4)
  const query = await pixels
    .find({}, { color: 1, _id: 0 })
    .sort({ index: 'asc' })
    .lean()
  query.forEach((pixel, i) => {
    const { color } = pixel
    const start = i * 4
    cache[start + 0] = color[0]
    cache[start + 1] = color[1]
    cache[start + 2] = color[2]
    cache[start + 3] = 255
  })
  await client.set('pixels', Buffer.from(cache))
}
