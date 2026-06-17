import express from 'express'
import { errorHandler } from './middleware/error-handler.js'
import { healthRoutes } from './routes/health-routes.js'

export const app = express()

app.use(express.json())
app.use(healthRoutes)

app.use((_request, response) => {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  })
})

app.use(errorHandler)
