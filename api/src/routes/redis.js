import { Router } from 'express'

import { bufferToArray, syncRedis } from '../services/redis'

const router = Router({ mergeParams: true })
/**
 * TEMPLATES
 */
router.get('/sync', syncRedis)
router.get('/get', bufferToArray)

export default router
