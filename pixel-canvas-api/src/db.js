import mongoose from 'mongoose'
import { log, error } from './utils/debug'
import pixels from './models/pixel'

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
  try {
    let count = await pixels.countDocuments({})
    let page = 0
    const pageSize = 5000
    while (count < numPixels) {
      let additional = pixelSeed - count
      if (additional > pageSize) additional = pageSize
      // init pixel canvas
      const pixelArray = []
      for (let i = 0; i < additional; i++) {
        // const color = new Uint8ClampedArray.from([255, 255, 255, 255])
        const color = [255, 255, 255]
        pixelArray.push({ color: color, index: page * pageSize + i })
      }
      try {
        await pixels.insertMany(pixelArray)
        count = await pixels.countDocuments({})
        page++
      } catch (err) {
        error(err)
      }
    }
    log('DB ready!')
  } catch (err) {
    error('failed during db population', err)
  }
}

export default initDB
