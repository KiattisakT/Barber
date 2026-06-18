import { Router } from 'express'
import { HttpError } from '../errors/http-error.js'
import { getQueueDate } from '../lib/queue-date.js'
import { getAdminQueueToday } from '../services/admin-queue-service.js'
import { createAdminBlockedTime, createAdminWalkIn } from '../services/admin-mutation-service.js'
import { isQueueStatus, updateQueueItemStatus } from '../services/queue-status-service.js'

export const adminQueueRoutes = Router()

adminQueueRoutes.get('/shops/:shopSlug/queue/today', async (request, response) => {
  const dateQuery = typeof request.query.date === 'string' ? request.query.date : undefined
  const queueDate = getQueueDate(dateQuery)

  if (!queueDate) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid date query. Expected YYYY-MM-DD.', {
      date: request.query.date,
    })
  }

  const result = await getAdminQueueToday(request.params.shopSlug, queueDate)
  response.json(result)
})

adminQueueRoutes.patch('/queue-items/:id/status', async (request, response) => {
  const status = request.body?.status

  if (!isQueueStatus(status)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid queue status.', {
      status,
    })
  }

  const result = await updateQueueItemStatus(request.params.id, status)
  response.json(result)
})

adminQueueRoutes.post('/walk-ins', async (request, response) => {
  const result = await createAdminWalkIn({
    shopSlug: request.body?.shopSlug,
    serviceId: request.body?.serviceId,
    staffId: request.body?.staffId,
    customerName: request.body?.customerName,
    phone: request.body?.phone,
    internalNote: request.body?.internalNote,
  })

  response.status(201).json(result)
})

adminQueueRoutes.post('/blocked-times', async (request, response) => {
  const result = await createAdminBlockedTime({
    shopSlug: request.body?.shopSlug,
    staffId: request.body?.staffId,
    startsAt: request.body?.startsAt,
    endsAt: request.body?.endsAt,
    reason: request.body?.reason,
  })

  response.status(201).json(result)
})
