import type { Prisma } from '@prisma/client'
import { HttpError } from '../errors/http-error.js'
import { formatQueueDate } from '../lib/queue-date.js'
import { prisma } from '../prisma-client.js'

type QueueItemWithRelations = Prisma.QueueItemGetPayload<{
  include: {
    customer: true
    service: true
    staff: true
  }
}>

type BlockedTimeWithStaff = Prisma.BlockedTimeGetPayload<{
  include: {
    staff: true
  }
}>

const mapQueueItemDto = (item: QueueItemWithRelations) => ({
  id: item.id,
  shopId: item.shopId,
  queueNumber: item.queueNumber,
  queueDate: formatQueueDate(item.queueDate),
  customer: {
    id: item.customer.id,
    name: item.customer.name,
    phone: item.customer.phone,
    lineId: item.customer.lineId,
  },
  service: {
    id: item.service.id,
    name: item.service.name,
    category: item.service.category,
    durationMinutes: item.service.durationMinutes,
  },
  staff: {
    id: item.staff.id,
    name: item.staff.name,
  },
  source: item.source,
  status: item.status,
  startsAt: item.startsAt?.toISOString() ?? null,
  endsAt: item.endsAt?.toISOString() ?? null,
  estimatedWaitMinutes: item.estimatedWaitMinutes,
  queueAhead: item.queueAhead,
  bookingCode: item.bookingCode,
  customerNote: item.customerNote,
  internalNote: item.internalNote,
  tattooRequestId: item.tattooRequestId,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
})

const mapBlockedTimeDto = (blockedTime: BlockedTimeWithStaff) => ({
  id: blockedTime.id,
  shopId: blockedTime.shopId,
  staffId: blockedTime.staffId,
  staffName: blockedTime.staff.name,
  startsAt: blockedTime.startsAt.toISOString(),
  endsAt: blockedTime.endsAt.toISOString(),
  reason: blockedTime.reason,
  createdAt: blockedTime.createdAt.toISOString(),
})

export const getAdminQueueToday = async (shopSlug: string, queueDate: Date) => {
  const shop = await prisma.shop.findUnique({
    where: { slug: shopSlug },
    select: {
      id: true,
      slug: true,
      displayName: true,
      timezone: true,
    },
  })

  if (!shop) {
    throw new HttpError(404, 'SHOP_NOT_FOUND', `Shop ${shopSlug} was not found`)
  }

  const [items, blockedTimes] = await Promise.all([
    prisma.queueItem.findMany({
      where: {
        shopId: shop.id,
        queueDate,
      },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: [{ startsAt: 'asc' }, { queueNumber: 'asc' }],
    }),
    prisma.blockedTime.findMany({
      where: {
        shopId: shop.id,
        startsAt: {
          gte: queueDate,
        },
        endsAt: {
          lt: new Date(queueDate.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        staff: true,
      },
      orderBy: [{ startsAt: 'asc' }],
    }),
  ])

  const activeItems = items.filter((item) => !['completed', 'cancelled', 'no_show'].includes(item.status))
  const checkedInItems = items.filter((item) => item.status === 'checked_in')
  const pendingTattooItems = items.filter((item) => item.status === 'pending_review')
  const inProgressItem = items.find((item) => item.status === 'in_progress')

  return {
    date: formatQueueDate(queueDate),
    shop,
    items: items.map(mapQueueItemDto),
    blockedTimes: blockedTimes.map(mapBlockedTimeDto),
    summary: {
      activeCount: activeItems.length,
      checkedInCount: checkedInItems.length,
      pendingTattooCount: pendingTattooItems.length,
      inProgressQueueNumber: inProgressItem?.queueNumber ?? null,
    },
  }
}
