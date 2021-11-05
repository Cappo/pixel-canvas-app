import Redis from 'ioredis'
import { error, redis } from '../utils/debug'

export let client

const initRedis = async () => {
  client = new Redis(6379, process.env.REDIS_ADDR)

  client.on('error', (err) => error('Redis Client Error', err))
  redis('Redis connected!')

  return client
}

export default initRedis
