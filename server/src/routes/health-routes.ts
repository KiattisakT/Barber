import { Router } from 'express'
import { env } from '../config/env.js'

export const healthRoutes = Router()

healthRoutes.get('/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'dream-catcher-server',
    env: env.nodeEnv,
  })
})
