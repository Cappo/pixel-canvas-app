import Redis from 'ioredis'
import { error, redis } from '../utils/debug'

export let client

const initRedis = async ({ pixelSeed }) => {
  client = new Redis(6379, process.env.REDIS_ADDR)

  client.on('error', (err) => error('Redis Client Error', err))
  redis('Redis connected!')

  let array = new Uint8ClampedArray(pixelSeed * 4).map(() => 255)

  try {
    await client.set('pixels', Buffer.from(array))
  } catch (e) {
    error('failed to init redis cache', e)
  }

  return client
}

export default initRedis
