import mongoose from 'mongoose'
import { log, error } from './utils/debug'
import pixels from './models/pixel'
import { syncPixelCacheWithDB } from './redis/pixels'
import { client } from './redis/init'

mongoose.Promise = global.Promise

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

const initDB = async ({ pixelSeed } = {}) => {
  const numPixels = pixelSeed === undefined ? 10000 : pixelSeed
  try {
    await mongoose.connect(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_ADDR}:27017/`,
      options
    )
    log('Successfully connected to mongo')
    // return mongoServer
  } catch (err) {
    error('Failed to init DB', err)
  }
  const start = new Date().getTime()
  try {
    let count = await pixels.countDocuments({})
    if (count < numPixels) {
      let page = 0
      const pageSize = 100000
      while (count < numPixels) {
        let additional = pixelSeed - count
        if (additional > pageSize) additional = pageSize
        // init pixel canvas
        const pixelArray = new Array(additional)
        for (let i = 0; i < additional; i++) {
          pixelArray[i] = { index: page * pageSize + i }
        }
        try {
          await pixels.insertMany(pixelArray, {
            lean: true,
          })
          count += additional
          page++
        } catch (err) {
          error(err)
        }
      }
    }
  } catch (err) {
    error('failed during db population', err)
  } finally {
    try {
      await pixels.ensureIndexes()
      const redisPixelCount = await client.bitcount('pixels')
      if (redisPixelCount === 0) {
        await syncPixelCacheWithDB()
      }
      const end = new Date().getTime()
      log('hydration time', `${((end - start) / 1000).toFixed(1)} seconds`)
      log('DB ready!')
    } catch (e) {
      error('error during index or redis sync', e)
    }
  }
}

export default initDB
