import HttpStatus from 'http-status-codes'
import { client } from '../redis/init'
import pixels from '../models/pixel'
import { error } from '../utils/debug'
import handleErrors from '../utils/handleErrors'

export const syncRedis = async (req, res) => {
  try {
    const cache = new Uint8ClampedArray(1000000 * 4)
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
    res.status(HttpStatus.OK).send({ status: 'OK' })
  } catch (e) {
    error('There was a problem trying to sync redis with the database')
    handleErrors(e, res)
  }
}
