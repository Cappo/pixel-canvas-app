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
  },
  {
    strict: true,
    versionKey: false,
    autoIndex: true,
    timestamps: true,
  }
)

const model = mongoose.model('canvas', canvasSchema)

export default model
