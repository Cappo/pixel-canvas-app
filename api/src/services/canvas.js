import canvas from '../models/canvas'
import handleErrors from '../utils/handleErrors'
import { syncPixelCacheWithDB } from '../redis/pixels'

export const getAllCanvases = async (req, res) => {
  const docs = await canvas.find({}).sort({ createdAt: -1, _id: -1 }).lean()
  res.status(200).send(docs)
}

export const getCanvasById = async (req, res) => {
  const doc = await canvas.findById(req.params.canvasId)
  res.status(200).send(doc)
}

export const createCanvas = async (req, res) => {
  const { height, width, name } = req.body
  if (height * width > 1000000) {
    res.status(400).send({
      error: 'Bad Request',
      message: 'Canvas size cannot exceed 1,000,000.',
    })
  } else {
    try {
      const doc = await canvas.create({
        width,
        height,
        name: name.length ? name : undefined,
      })
      await syncPixelCacheWithDB(doc._id)
      res.status(201).send(doc)
    } catch (e) {
      handleErrors(e, res)
    }
  }
}
