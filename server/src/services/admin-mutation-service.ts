import { HttpError } from '../errors/http-error.js'
import { getQueueDate } from '../lib/queue-date.js'
import { prisma } from '../prisma-client.js'
import { getNextQueueNumber } from './queue-number-service.js'

type CreateWalkInInput = {
  shopSlug: string
  serviceId: string
  staffId: string
  customerName: string
  phone?: string
  internalNote?: string
}

type CreateBlockedTimeInput = {
  shopSlug: string
  staffId: string
  startsAt: string
  endsAt: string
  reason: string
}

const activeQueueStatuses = ['confirmed', 'checked_in', 'in_progress'] as const

const requireNonEmpty = (value: string | undefined, field: string) => {
  if (!value?.trim()) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required`, { [field]: 'Required' })
  }

  return value.trim()
}

const parseDateTime = (value: string, field: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} must be a valid ISO date string`, { [field]: value })
  }

  return date
}

const getShopBySlug = async (shopSlug: string) => {
  const shop = await prisma.shop.findUnique({ where: { slug: shopSlug }, select: { id: true, slug: true } })

  if (!shop) {
    throw new HttpError(404, 'SHOP_NOT_FOUND', `Shop ${shopSlug} was not found`)
  }

  return shop
}

const calculateWaitEstimate = async (shopId: string) => {
  const activeItems = await prisma.queueItem.findMany({
    where: {
      shopId,
      status: { in: [...activeQueueStatuses] },
      service: { category: 'barber' },
    },
    select: {
      service: {
        select: {
          durationMinutes: true,
        },
      },
    },
  })

  return activeItems.reduce(
    (summary, item) => ({
      estimatedWaitMinutes: summary.estimatedWaitMinutes + item.service.durationMinutes,
      queueAhead: summary.queueAhead + 1,
    }),
    { estimatedWaitMinutes: 0, queueAhead: 0 },
  )
}

export const createAdminWalkIn = async (input: CreateWalkInInput) => {
  const customerName = requireNonEmpty(input.customerName, 'customerName')
  const phone = input.phone?.trim() || '-'
  const queueDate = getQueueDate()

  if (!queueDate) {
    throw new HttpError(500, 'QUEUE_DATE_ERROR', 'Could not resolve queue date')
  }

  const shop = await getShopBySlug(input.shopSlug)
  const [service, staff, waitEstimate] = await Promise.all([
    prisma.service.findFirst({
      where: {
        id: input.serviceId,
        shopId: shop.id,
        isActive: true,
      },
      select: {
        id: true,
        durationMinutes: true,
      },
    }),
    prisma.staff.findFirst({
      where: {
        id: input.staffId,
        shopId: shop.id,
        status: 'active',
      },
      select: {
        id: true,
      },
    }),
    calculateWaitEstimate(shop.id),
  ])

  if (!service) {
    throw new HttpError(404, 'SERVICE_NOT_FOUND', `Service ${input.serviceId} was not found`)
  }

  if (!staff) {
    throw new HttpError(404, 'STAFF_NOT_FOUND', `Staff ${input.staffId} was not found`)
  }

  return prisma.$transaction(async (tx) => {
    const queueNumber = await getNextQueueNumber(tx, shop.id, queueDate, 'A')
    const now = new Date()
    const endsAt = new Date(now.getTime() + service.durationMinutes * 60 * 1000)
    const customer = await tx.customer.create({
      data: {
        shopId: shop.id,
        name: customerName,
        phone,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        lineId: true,
      },
    })

    const queueItem = await tx.queueItem.create({
      data: {
        shopId: shop.id,
        queueNumber,
        queueDate,
        customerId: customer.id,
        serviceId: service.id,
        staffId: staff.id,
        source: 'walk_in',
        status: 'checked_in',
        startsAt: now,
        endsAt,
        estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
        queueAhead: waitEstimate.queueAhead,
        bookingCode: `WI-${queueNumber}`,
        internalNote: input.internalNote?.trim() || 'เพิ่มจากหน้า admin',
      },
      select: {
        id: true,
        queueNumber: true,
        source: true,
        status: true,
        bookingCode: true,
        estimatedWaitMinutes: true,
        queueAhead: true,
      },
    })

    return {
      queueItem,
    }
  })
}

export const createAdminBlockedTime = async (input: CreateBlockedTimeInput) => {
  const reason = requireNonEmpty(input.reason, 'reason')
  const startsAt = parseDateTime(input.startsAt, 'startsAt')
  const endsAt = parseDateTime(input.endsAt, 'endsAt')

  if (endsAt <= startsAt) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'endsAt must be after startsAt', { startsAt: input.startsAt, endsAt: input.endsAt })
  }

  const shop = await getShopBySlug(input.shopSlug)
  const staff = await prisma.staff.findFirst({
    where: {
      id: input.staffId,
      shopId: shop.id,
      status: 'active',
    },
    select: {
      id: true,
    },
  })

  if (!staff) {
    throw new HttpError(404, 'STAFF_NOT_FOUND', `Staff ${input.staffId} was not found`)
  }

  const [blockedConflict, queueConflict] = await Promise.all([
    prisma.blockedTime.findFirst({
      where: {
        shopId: shop.id,
        staffId: staff.id,
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { id: true },
    }),
    prisma.queueItem.findFirst({
      where: {
        shopId: shop.id,
        staffId: staff.id,
        status: { in: [...activeQueueStatuses] },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { id: true, queueNumber: true },
    }),
  ])

  if (blockedConflict) {
    throw new HttpError(409, 'BLOCKED_TIME_CONFLICT', 'Blocked time overlaps another blocked time', { blockedTimeId: blockedConflict.id })
  }

  if (queueConflict) {
    throw new HttpError(409, 'BLOCKED_TIME_CONFLICT', 'Blocked time overlaps an active queue item', {
      queueItemId: queueConflict.id,
      queueNumber: queueConflict.queueNumber,
    })
  }

  const blockedTime = await prisma.blockedTime.create({
    data: {
      shopId: shop.id,
      staffId: staff.id,
      startsAt,
      endsAt,
      reason,
    },
    select: {
      id: true,
      shopId: true,
      staffId: true,
      startsAt: true,
      endsAt: true,
      reason: true,
      createdAt: true,
    },
  })

  return {
    blockedTime: {
      ...blockedTime,
      startsAt: blockedTime.startsAt.toISOString(),
      endsAt: blockedTime.endsAt.toISOString(),
      createdAt: blockedTime.createdAt.toISOString(),
    },
  }
}
