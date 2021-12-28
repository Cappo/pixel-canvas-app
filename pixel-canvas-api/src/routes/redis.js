import { Router } from 'express'

import { syncRedis } from '../services/redis'

const router = Router({ mergeParams: true })
/**
 * TEMPLATES
 */
router.get('/sync', syncRedis)

export default router
