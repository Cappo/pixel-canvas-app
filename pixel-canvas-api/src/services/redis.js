import HttpStatus from 'http-status-codes'
import { client } from '../redis/init'
import pixels from '../models/pixel'
import { error, log } from '../utils/debug'
import handleErrors from '../utils/handleErrors'

export const syncRedis = async (req, res) => {
  try {
    const data = await pixels
      .find({}, { color: 1, _id: 0 })
      .sort({ index: 'asc' })
    log('example', data[0])
    const cache = new Uint8ClampedArray(data.length * 4)
    data.forEach((pixel, i) => {
      const { color } = pixel
      for (let j = 0; j < color.length; j++) {
        cache[i * 4 + j] = color[j]
      }
      cache[i * 4 + 3] = 255
    })
    log(cache)
    await client.set('pixels', Buffer.from(cache))
    res.status(HttpStatus.OK).send({ status: 'OK' })
  } catch (e) {
    error('There was a problem trying to sync redis with the database')
    handleErrors(e, res)
  }
}
