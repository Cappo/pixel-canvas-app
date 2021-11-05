import mongoose from 'mongoose'

const pixelSchema = new mongoose.Schema(
  {
    color: { type: [mongoose.Schema.Types.Number], required: true },
    index: {
      type: mongoose.Schema.Types.Number,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    strict: true,
    versionKey: false,
    autoIndex: false,
  }
)

const model = mongoose.model('pixel', pixelSchema)

export default model
