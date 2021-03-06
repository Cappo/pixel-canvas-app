import { Router } from 'express'

import { getAllPixels, getPixelCount } from '../services/pixel'

const router = Router({ mergeParams: true })
/**
 * TEMPLATES
 */
router.get('/', getAllPixels)

router.get('/count', getPixelCount)

export default router
