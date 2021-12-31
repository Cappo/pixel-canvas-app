import pixels from '../models/pixel'
import handleErrors from '../utils/handleErrors'
import BadRequestError from '../utils/BadRequestError'
import { error } from '../utils/debug'

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

export const updatePixel = async (canvasId, index, color) => {
  try {
    const search = { index, canvasId }
    const update = {
      $set: {
        color,
      },
    }
    const options = { new: true, useFindAndModify: false, upsert: true }

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
