import pixels from '../models/pixel'
import HttpStatus from 'http-status-codes'
import handleErrors from '../utils/handleErrors'
import BadRequestError from '../utils/BadRequestError'
import { error } from '../utils/debug'

export const getAllPixels = async (req, res) => {
  try {
    let docs = await pixels
      .find({}, { color: 1, _id: 0 })
      .sort({ index: 'asc' })
      .lean()
    docs = docs.map((p) => p.color)
    res.status(HttpStatus.OK).send(docs)
  } catch (err) {
    handleErrors(err, res)
  }
}

export const getPixelCount = async (req, res) => {
  const len = await pixels.estimatedDocumentCount()
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
