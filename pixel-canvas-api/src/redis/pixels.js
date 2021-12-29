import { client } from './init'
import { error, redis } from '../utils/debug'
import pixels from '../models/pixel'
import canvas from '../models/canvas'

export const getPixelCache = async (canvasId) => {
  try {
    redis(canvasId)
    const data = await client.getBuffer(canvasId)
    return data
  } catch (e) {
    error('failed to getPixelCache', e)
  }
}

export const setPixelCache = async (canvasId, index, buffer) => {
  try {
    const offset = index * 4
    const resp = await client.setrangeBuffer(canvasId, offset, buffer)
    return resp
  } catch (e) {
    error('failed to setPixelCache', e)
  }
}

export const syncPixelCacheWithDB = async (canvasId) => {
  const { height, width } = await canvas.findById(canvasId)
  const cache = new Uint8ClampedArray(height * width * 4)
  const query = await pixels
    .find({ canvasId }, { color: 1, _id: 0 })
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
  await client.set(canvasId, Buffer.from(cache))
}
