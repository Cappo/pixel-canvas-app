import paintstroke from '../models/paintstroke'
import { error } from '../utils/debug'

export const getLastPaintstroke = async (user) => {
  // 1. make sure user isn't on cooldown by getting last paintstroke
  try {
    const search = { user }
    const doc = await paintstroke.findOne(search).sort({ createdAt: -1 })
    return doc
  } catch (e) {
    error(e)
  }
}

export const createPaintstroke = async (index, user) => {
  try {
    await paintstroke.create({
      index,
      user,
    })
  } catch (e) {
    error(e)
  }
}
