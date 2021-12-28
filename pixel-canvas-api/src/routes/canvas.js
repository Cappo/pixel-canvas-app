import { Router } from 'express'
import pixelRoutes from './pixel'
import redisRoutes from './redis'

import { createCanvas, getAllCanvases, getCanvasById } from '../services/canvas'

const router = Router()
/**
 * TEMPLATES
 */
router.post('/', createCanvas)

router.get('/', getAllCanvases)
router.get('/:canvasId', getCanvasById)

router.use('/:canvasId/pixels', pixelRoutes)
router.use('/:canvasId/redis', redisRoutes)

export default router
