import { createClient } from 'redis'
import { error, redis, log } from '../utils/debug'

export let client

const initRedis = async () => {
  const redisPort = 6379
  client = createClient(redisPort)

  client.on('error', (err) => error('Redis Client Error', err));
  redis('Redis connected!')

  await client.connect()
  // const colors = ['blue', 'red', 'green']
  // const multi = client.multi()
  // for (let i = 0; i < 100;  i++) {
    // multi.rPush('pixels', '#ffffff')
  // }
  // const msg = await multi.exec()
  // const lset = await client.lSet('pixels', 10, '#eeeeee')
  // log('lset', lset)
  // log('msg', msg)
  // const ten = await client.lRange('pixels', 10, 10)
  // log('ten', ten)
  // const all = await client.lRange('pixels', 0, -1)
  // log('all', all)
  // const thousand = 1000
  // const multi = client.multi()
  // for (var i = 0; i <= thousand; i++) {
  //   for (var j = 0; j<= 10; j++) {
  //     multi.rPush('pixels', '#ffffff')
  //   }
  //   redis('redis - ' + i)
  //   await multi.exec()
  // }
  // const len = await client.lLen('pixels')
  // redis('length', len)
  

  return client
}

export default initRedis
