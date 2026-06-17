import { app } from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.port, () => {
  console.log(`Dream Catcher server listening on http://localhost:${env.port}`)
})

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`Received ${signal}. Closing HTTP server.`)
  server.close(() => {
    process.exit(0)
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
