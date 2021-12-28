import pixels from '../models/pixel'
import canvas from '../models/canvas'
import { syncPixelCacheWithDB } from '../redis/pixels'
import { client } from '../redis/init'
import handleErrors from '../utils/handleErrors'
import BadRequestError from '../utils/BadRequestError'
import { error, log } from '../utils/debug'

export const getAllPixels = async (req, res) => {
  try {
    let docs = await pixels
      .find({ canvasId: req.params.canvasId }, { color: 1, _id: 0 })
      .sort({ index: 'asc' })
      .lean()
    docs = docs.map((p) => p.color)
    res.status(200).send(docs)
  } catch (err) {
    handleErrors(err, res)
  }
}

export const getPixelCount = async (req, res) => {
  const len = await pixels.count({ canvasId: req.params.canvasId })
  res.status(200).send({ length: len })
}

export const updatePixel = async (index, color) => {
  try {
    const search = { index }
    const update = {
      $set: {
        color,
      },
    }
    const options = { new: true, useFindAndModify: false }

    const doc = await pixels.findOneAndUpdate(search, update, options)
    if (!doc) {
      throw new BadRequestError('Pixel not found... wait for population')
    }

    return true
  } catch (err) {
    error(err)
    return false
  }
}

export const seedPixelsForCanvas = async (canvasId) => {
  log('Creating pixels for ' + canvasId)
  const start = new Date().getTime()
  let canvasDoc
  let pixelSeed = 0
  try {
    canvasDoc = await canvas.findById(canvasId)
    pixelSeed = canvasDoc.width * canvasDoc.height
  } catch (e) {
    error(canvasId + 'Not a valid canvas')
  }
  try {
    log('pixelSeed', pixelSeed)
    let count = 0
    let page = 0
    const pageSize = 100000 // about max mongo can handle at a time
    while (count < pixelSeed) {
      let additional = pixelSeed - count
      if (additional > pageSize) additional = pageSize
      // init pixel canvas
      const pixelArray = new Array(additional)
      for (let i = 0; i < additional; i++) {
        pixelArray[i] = {
          index: page * pageSize + i,
          canvasId: canvasId.toString(),
        }
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
    try {
      canvasDoc.status = 'READY'
      canvasDoc.save()
    } catch (e) {
      error(e)
    }
  } catch (err) {
    error('failed during db population', err)
  } finally {
    try {
      await pixels.ensureIndexes()
      const redisPixelCount = await client.bitcount(canvasId)
      if (redisPixelCount === 0) {
        await syncPixelCacheWithDB(canvasId)
      }
      const end = new Date().getTime()
      log('hydration time', `${((end - start) / 1000).toFixed(1)} seconds`)
    } catch (e) {
      error('error during index or redis sync', e)
    }
  }
}
