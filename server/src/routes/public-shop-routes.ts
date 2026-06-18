import { Router } from 'express'
import { HttpError } from '../errors/http-error.js'
import { getQueueDate } from '../lib/queue-date.js'
import { createCustomerAppointment, createCustomerQueueTicket, createCustomerTattooRequest, getPublicQueueToday, getPublicShop } from '../services/public-shop-service.js'

export const publicShopRoutes = Router()

publicShopRoutes.get('/shops/:shopSlug/public', async (request, response) => {
  const result = await getPublicShop(request.params.shopSlug)
  response.json(result)
})

publicShopRoutes.get('/shops/:shopSlug/queue/today', async (request, response) => {
  const dateQuery = typeof request.query.date === 'string' ? request.query.date : undefined
  const queueDate = getQueueDate(dateQuery)

  if (!queueDate) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Invalid date query. Expected YYYY-MM-DD.', {
      date: request.query.date,
    })
  }

  const result = await getPublicQueueToday(request.params.shopSlug, queueDate, {
    bookingCode: typeof request.query.bookingCode === 'string' ? request.query.bookingCode : undefined,
    queueNumber: typeof request.query.queueNumber === 'string' ? request.query.queueNumber : undefined,
  })
  response.json(result)
})

publicShopRoutes.post('/shops/:shopSlug/queue/tickets', async (request, response) => {
  const serviceId = request.body?.serviceId

  if (typeof serviceId !== 'string' || !serviceId.trim()) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'serviceId is required', { serviceId: 'Required' })
  }

  const result = await createCustomerQueueTicket({
    shopSlug: request.params.shopSlug,
    serviceId,
    customerName: request.body?.customerName,
    phone: request.body?.phone,
    customerNote: request.body?.customerNote,
  })

  response.status(201).json(result)
})

publicShopRoutes.post('/shops/:shopSlug/appointments', async (request, response) => {
  const result = await createCustomerAppointment({
    shopSlug: request.params.shopSlug,
    serviceId: request.body?.serviceId,
    staffId: request.body?.staffId,
    startsAt: request.body?.startsAt,
    customerName: request.body?.customerName,
    phone: request.body?.phone,
    customerNote: request.body?.customerNote,
  })

  response.status(201).json(result)
})

publicShopRoutes.post('/shops/:shopSlug/tattoo-requests', async (request, response) => {
  const result = await createCustomerTattooRequest({
    shopSlug: request.params.shopSlug,
    customerName: request.body?.customerName,
    phone: request.body?.phone,
    placement: request.body?.placement,
    sizeEstimate: request.body?.sizeEstimate,
    budgetEstimate: request.body?.budgetEstimate,
    preferredDateText: request.body?.preferredDateText,
    description: request.body?.description,
    referenceImageNames: Array.isArray(request.body?.referenceImageNames) ? request.body.referenceImageNames : undefined,
  })

  response.status(201).json(result)
})
