import { client } from './init'
import { error } from '../utils/debug'

export const getPixelCache = async () => {
  try {
    const data = await client.getBuffer('pixels')
    return data
  } catch (e) {
    error('failed to getPixelCache', e)
  }
}

export const setPixelCache = async (index, buffer) => {
  try {
    const offset = index * 4
    const resp = await client.setrangeBuffer('pixels', offset, buffer)
    return resp
  } catch (e) {
    error('failed to setPixelCache', e)
  }
}
