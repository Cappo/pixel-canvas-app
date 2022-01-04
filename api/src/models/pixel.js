import mongoose from 'mongoose'

const pixelSchema = new mongoose.Schema(
  {
    color: {
      type: [mongoose.Schema.Types.Number],
      required: true,
      default: [255, 255, 255],
    },
    index: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    canvasId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    strict: true,
    versionKey: false,
    autoIndex: false,
  }
)
pixelSchema.index({ canvasId: 1, index: 1 }, { unique: true })

const model = mongoose.model('pixel', pixelSchema)

export default model
