import mongoose from 'mongoose'
import { log, error } from './utils/debug'

mongoose.Promise = global.Promise

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}

const initDB = async ({ pixelSeed }) => {
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
}

export default initDB
