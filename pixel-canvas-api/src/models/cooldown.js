import mongoose from 'mongoose'

const cooldownSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.String,
      unique: true,
      index: true,
      required: true,
    },
  },
  {
    strict: true,
    versionKey: false,
    autoIndex: true,
    timestamps: true,
  }
)

const model = mongoose.model('cooldown', cooldownSchema)

export default model
