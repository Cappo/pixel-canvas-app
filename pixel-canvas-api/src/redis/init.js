import Redis from 'ioredis'
import { error, redis } from '../utils/debug'

export let client

const initRedis = async ({ pixelSeed }) => {
  client = new Redis(6379, process.env.REDIS_ADDR)

  client.on('error', (err) => error('Redis Client Error', err))
  redis('Redis connected!')

  let array = new Uint8ClampedArray(pixelSeed * 4)
  array = array.map(() => 255)
  let buffer = Buffer.from(array)
  console.log(array)
  console.log(buffer)

  // TODO: init from DB

  try {
    await client.set('pixels', buffer)
  } catch (e) {
    error('failed to init redis cache', e)
  }
  // console.log('set', set)
  // let array2 = new Uint8ClampedArray(1 * 4)
  // buffer = Buffer.from(array2)
  // const setrange = await client.setrangeBuffer('pixels', 0, buffer)
  // console.log('setrange', setrange)
  // const data = await client.getBuffer('pixels')
  // console.log('data', data)
  // const d2 = await client.getrangeBuffer('pixels', 0, 3)
  // console.log('d2', d2.toString('hex'))

  return client
}

export default initRedis
