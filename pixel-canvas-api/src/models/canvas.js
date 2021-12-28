import mongoose from 'mongoose'

const canvasSchema = new mongoose.Schema(
  {
    width: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    height: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    name: {
      type: mongoose.Schema.Types.String,
      default: 'Untitled',
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ['BUILDING', 'READY'],
      default: 'BUILDING',
    },
  },
  {
    strict: true,
    versionKey: false,
    autoIndex: true,
  }
)

const model = mongoose.model('canvas', canvasSchema)

export default model
