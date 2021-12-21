import { syncPixelCacheWithDB } from '../redis/pixels'
import { error } from '../utils/debug'
import handleErrors from '../utils/handleErrors'

export const syncRedis = async (req, res) => {
  try {
    await syncPixelCacheWithDB()
    res.status(200).send({ status: 'OK' })
  } catch (e) {
    error('There was a problem trying to sync redis with the database')
    handleErrors(e, res)
  }
}
