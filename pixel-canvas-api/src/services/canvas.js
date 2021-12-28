import canvas from '../models/canvas'
import handleErrors from '../utils/handleErrors'
import { seedPixelsForCanvas } from './pixel'

export const getAllCanvases = async (req, res) => {
  const docs = await canvas.find({}).lean()
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
        name,
      })
      seedPixelsForCanvas(doc._id) // async process, do not wait during HTTP request
      res.status(201).send(doc)
    } catch (e) {
      handleErrors(e)
    }
  }
}
