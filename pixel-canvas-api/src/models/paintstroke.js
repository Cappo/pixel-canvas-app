import mongoose from 'mongoose'

const paintstrokeSchema = new mongoose.Schema(
  {
    user: mongoose.Schema.Types.String,
    index: mongoose.Schema.Types.Number, // index of pixel painted
    canvasId: mongoose.Schema.Types.ObjectId,
  },
  {
    strict: true,
    versionKey: false,
    autoIndex: true,
    timestamps: true,
  }
)

const model = mongoose.model('paintstroke', paintstrokeSchema)

export default model
