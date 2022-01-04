import { getPixelCache, syncPixelCacheWithDB } from '../redis/pixels'
import { error } from '../utils/debug'
import handleErrors from '../utils/handleErrors'

export const syncRedis = async (req, res) => {
  try {
    await syncPixelCacheWithDB(req.params.canvasId)
    res.status(200).send({ status: 'OK' })
  } catch (e) {
    error('There was a problem trying to sync redis with the database')
    handleErrors(e, res)
  }
}

export const bufferToArray = async (req, res) => {
  try {
    const buffer = await getPixelCache(req.params.canvasId)
    res.status(200).send(buffer)
    // const data = new Uint8ClampedArray(buffer)
  } catch (e) {
    error('Could not convert cache')
    handleErrors(e, res)
  }
}
