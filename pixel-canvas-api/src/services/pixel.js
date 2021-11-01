import pixels from '../models/pixel'
import HttpStatus from 'http-status-codes'
import handleErrors from '../utils/handleErrors'
import BadRequestError from '../utils/BadRequestError'
import { log, error } from '../utils/debug'
import { client } from '../redis/init'

export const getAllPixels = async (req, res) => {
  try {
    // const { page, limit } = req.query
    let docs
    const page = Number.parseInt(req.query.page)
    const limit = Number.parseInt(req.query.limit)
    if (page !== undefined && limit !== undefined) {
      docs = await pixels.find({}, { color: 1, _id: 0 }).sort({index: 'asc'}).skip(page * limit).limit(limit).exec()
    } else {
      docs = await pixels.find({}, { color: 1, _id: 0 }).sort({index: 'asc'})
    }
    docs = docs.map(p => p.color)
    res.status(HttpStatus.OK).send(docs)
  } catch (err) {
    handleErrors(err, res)
  }
}

export const getPixelCount = async (req, res) => {
  const len = await pixels.countDocuments({})
  res.status(HttpStatus.OK).send({ length: len })
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
