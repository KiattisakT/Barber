import express from 'express'
import { errorHandler } from './middleware/error-handler.js'
import { adminQueueRoutes } from './routes/admin-queue-routes.js'
import { publicShopRoutes } from './routes/public-shop-routes.js'
import { healthRoutes } from './routes/health-routes.js'

export const app = express()

app.use(express.json())
app.use(healthRoutes)
app.use('/api', publicShopRoutes)
app.use('/api/admin', adminQueueRoutes)

app.use((_request, response) => {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  })
})

app.use(errorHandler)
