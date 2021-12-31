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
  const size = height * width * 4
  const cache = new Uint8ClampedArray(size)
  const query = await pixels
    .find({ canvasId }, { color: 1, index: 1, _id: 0 })
    .sort({ index: 'asc' })
    .lean()

  let j = 0
  let end = query.length === 0
  for (let i = 0; i < size; i++) {
    const start = i * 4
    let ptr = query[j]
    if (!end && ptr.index === i) {
      cache[start + 0] = ptr.color[0]
      cache[start + 1] = ptr.color[1]
      cache[start + 2] = ptr.color[2]
      cache[start + 3] = 255
      if (j === query.length - 1) {
        end = true
      } else {
        j++
      }
    } else {
      cache[start + 0] = 255
      cache[start + 1] = 255
      cache[start + 2] = 255
      cache[start + 3] = 255
    }
  }
  await client.set(canvasId, Buffer.from(cache))
}
