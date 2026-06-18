import type { Prisma } from '@prisma/client'
import { HttpError } from '../errors/http-error.js'
import { formatQueueDate, getQueueDate } from '../lib/queue-date.js'
import { prisma } from '../prisma-client.js'
import { getNextQueueNumber } from './queue-number-service.js'

type CreateCustomerTicketInput = {
  shopSlug: string
  serviceId: string
  customerName?: string
  phone?: string
  customerNote?: string
}

type QueueItemWithRelations = Prisma.QueueItemGetPayload<{
  include: {
    customer: true
    service: true
    staff: true
  }
}>

const activeBarberStatuses = ['confirmed', 'checked_in', 'in_progress'] as const
const terminalStatuses = ['completed', 'cancelled', 'no_show'] as const

const getShopBySlug = async (shopSlug: string) => {
  const shop = await prisma.shop.findUnique({
    where: { slug: shopSlug },
    select: {
      id: true,
      slug: true,
      name: true,
      displayName: true,
      phone: true,
      address: true,
      mapUrl: true,
      timezone: true,
      status: true,
    },
  })

  if (!shop) {
    throw new HttpError(404, 'SHOP_NOT_FOUND', `Shop ${shopSlug} was not found`)
  }

  return shop
}

const mapServiceDto = (service: {
  id: string
  shopId: string
  category: 'barber' | 'tattoo'
  name: string
  description: string | null
  priceLabel: string
  priceAmount: Prisma.Decimal | null
  durationMinutes: number
  bufferMinutes: number
  image: string | null
  isActive: boolean
}) => ({
  id: service.id,
  shopId: service.shopId,
  category: service.category,
  name: service.name,
  description: service.description,
  priceLabel: service.priceLabel,
  priceAmount: service.priceAmount === null ? null : Number(service.priceAmount),
  durationMinutes: service.durationMinutes,
  bufferMinutes: service.bufferMinutes,
  image: service.image,
  isActive: service.isActive,
})

const mapPublicQueueItem = (item: QueueItemWithRelations) => ({
  id: item.id,
  queueNumber: item.queueNumber,
  status: item.status,
  source: item.source,
  startsAt: item.startsAt?.toISOString() ?? null,
  endsAt: item.endsAt?.toISOString() ?? null,
  estimatedWaitMinutes: item.estimatedWaitMinutes,
  queueAhead: item.queueAhead,
  bookingCode: item.bookingCode,
  customer: {
    name: item.customer.name,
    phone: item.customer.phone,
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
})

const getWaitEstimate = async (shopId: string) => {
  const activeItems = await prisma.queueItem.findMany({
    where: {
      shopId,
      status: { in: [...activeBarberStatuses] },
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

export const getPublicShop = async (shopSlug: string, queueDate = getQueueDate()) => {
  if (!queueDate) {
    throw new HttpError(500, 'QUEUE_DATE_ERROR', 'Could not resolve queue date')
  }

  const shop = await getShopBySlug(shopSlug)
  const [services, todayHours] = await Promise.all([
    prisma.service.findMany({
      where: {
        shopId: shop.id,
        isActive: true,
      },
      orderBy: [{ category: 'asc' }, { durationMinutes: 'asc' }],
    }),
    prisma.businessHours.findFirst({
      where: {
        shopId: shop.id,
        staffId: null,
        dayOfWeek: queueDate.getUTCDay(),
      },
      select: {
        opensAt: true,
        closesAt: true,
        isClosed: true,
      },
    }),
  ])

  return {
    shop: {
      id: shop.id,
      slug: shop.slug,
      displayName: shop.displayName,
      phone: shop.phone,
      address: shop.address,
      mapUrl: shop.mapUrl,
      timezone: shop.timezone,
      status: shop.status,
      todayHours: todayHours ?? {
        opensAt: '10:00',
        closesAt: '20:00',
        isClosed: false,
      },
    },
    services: services.map(mapServiceDto),
  }
}

export const getPublicQueueToday = async (
  shopSlug: string,
  queueDate: Date,
  filters: { bookingCode?: string; queueNumber?: string } = {},
) => {
  const shop = await getShopBySlug(shopSlug)
  const [activeBarberItems, pendingTattooCount, current, counter, myQueue] = await Promise.all([
    prisma.queueItem.findMany({
      where: {
        shopId: shop.id,
        queueDate,
        status: { in: [...activeBarberStatuses] },
        service: { category: 'barber' },
      },
      include: {
        customer: true,
        service: true,
        staff: true,
      },
      orderBy: [{ startsAt: 'asc' }, { queueNumber: 'asc' }],
    }),
    prisma.queueItem.count({
      where: {
        shopId: shop.id,
        queueDate,
        status: 'pending_review',
        source: 'tattoo',
      },
    }),
    prisma.queueItem.findFirst({
      where: {
        shopId: shop.id,
        queueDate,
        status: 'in_progress',
        service: { category: 'barber' },
      },
      select: {
        queueNumber: true,
        status: true,
      },
      orderBy: [{ startsAt: 'asc' }],
    }),
    prisma.dailyQueueCounter.findUnique({
      where: {
        shopId_queueDate_prefix: {
          shopId: shop.id,
          queueDate,
          prefix: 'A',
        },
      },
      select: {
        lastNumber: true,
      },
    }),
    filters.bookingCode || filters.queueNumber
      ? prisma.queueItem.findFirst({
          where: {
            shopId: shop.id,
            queueDate,
            ...(filters.bookingCode ? { bookingCode: filters.bookingCode } : {}),
            ...(filters.queueNumber ? { queueNumber: filters.queueNumber } : {}),
          },
          include: {
            customer: true,
            service: true,
            staff: true,
          },
        })
      : Promise.resolve(null),
  ])

  const waitEstimate = activeBarberItems
    .filter((item) => !terminalStatuses.includes(item.status as (typeof terminalStatuses)[number]))
    .reduce(
      (summary, item) => ({
        estimatedWaitMinutes: summary.estimatedWaitMinutes + item.service.durationMinutes,
        queueAhead: summary.queueAhead + 1,
      }),
      { estimatedWaitMinutes: 0, queueAhead: 0 },
    )

  return {
    date: formatQueueDate(queueDate),
    activeQueueCount: activeBarberItems.length,
    pendingTattooCount,
    nextQueueNumber: `A${String((counter?.lastNumber ?? 0) + 1).padStart(3, '0')}`,
    estimatedWaitMinutes: waitEstimate.estimatedWaitMinutes,
    queueAhead: waitEstimate.queueAhead,
    current,
    myQueue: myQueue ? mapPublicQueueItem(myQueue) : null,
  }
}

export const createCustomerQueueTicket = async (input: CreateCustomerTicketInput) => {
  const queueDate = getQueueDate()
  const customerName = input.customerName?.trim() || 'ลูกค้าหน้าร้าน'
  const phone = input.phone?.trim() || '-'

  if (!queueDate) {
    throw new HttpError(500, 'QUEUE_DATE_ERROR', 'Could not resolve queue date')
  }

  const shop = await getShopBySlug(input.shopSlug)
  const [service, staff, waitEstimate] = await Promise.all([
    prisma.service.findFirst({
      where: {
        id: input.serviceId,
        shopId: shop.id,
        category: 'barber',
        isActive: true,
      },
      select: {
        id: true,
        durationMinutes: true,
      },
    }),
    prisma.staff.findFirst({
      where: {
        shopId: shop.id,
        role: 'barber',
        isBookable: true,
        status: 'active',
      },
      select: {
        id: true,
      },
      orderBy: [{ createdAt: 'asc' }],
    }),
    getWaitEstimate(shop.id),
  ])

  if (!service) {
    throw new HttpError(404, 'SERVICE_NOT_FOUND', `Service ${input.serviceId} was not found`)
  }

  if (!staff) {
    throw new HttpError(404, 'STAFF_NOT_FOUND', 'No active barber staff was found')
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
        bookingCode: `QT-${queueNumber}`,
        customerNote: input.customerNote?.trim() || 'รับบัตรคิวจากหน้าลูกค้า',
      },
      select: {
        id: true,
        queueNumber: true,
        source: true,
        status: true,
        estimatedWaitMinutes: true,
        queueAhead: true,
        bookingCode: true,
      },
    })

    return {
      queueItem,
    }
  })
}

type CreateAppointmentInput = {
  shopSlug: string
  serviceId: string
  staffId: string
  startsAt: string
  customerName?: string
  phone?: string
  customerNote?: string
}

type CreateTattooRequestInput = {
  shopSlug: string
  customerName?: string
  phone?: string
  placement?: string
  sizeEstimate?: string
  budgetEstimate?: string
  preferredDateText?: string
  description?: string
  referenceImageNames?: string[]
}

const parseDateTime = (value: string | undefined, field: string) => {
  if (!value) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required`, { [field]: 'Required' })
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} must be a valid ISO date string`, { [field]: value })
  }

  return date
}

const requireText = (value: string | undefined, field: string, minLength = 1) => {
  const text = value?.trim() ?? ''

  if (text.length < minLength) {
    throw new HttpError(400, 'VALIDATION_ERROR', `${field} is required`, { [field]: `Minimum length is ${minLength}` })
  }

  return text
}

const getQueueDateFromDateTime = (date: Date) => new Date(`${formatQueueDate(date)}T00:00:00.000Z`)

const formatBookingCodeTime = (date: Date) => `${String(date.getUTCHours()).padStart(2, '0')}${String(date.getUTCMinutes()).padStart(2, '0')}`

export const createCustomerAppointment = async (input: CreateAppointmentInput) => {
  const customerName = requireText(input.customerName, 'customerName', 2)
  const phone = requireText(input.phone, 'phone', 1)
  const startsAt = parseDateTime(input.startsAt, 'startsAt')
  const queueDate = getQueueDateFromDateTime(startsAt)
  const shop = await getShopBySlug(input.shopSlug)
  const [service, staff] = await Promise.all([
    prisma.service.findFirst({
      where: {
        id: input.serviceId,
        shopId: shop.id,
        category: 'barber',
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
        isBookable: true,
        status: 'active',
      },
      select: {
        id: true,
      },
    }),
  ])

  if (!service) {
    throw new HttpError(404, 'SERVICE_NOT_FOUND', `Service ${input.serviceId} was not found`)
  }

  if (!staff) {
    throw new HttpError(404, 'STAFF_NOT_FOUND', `Staff ${input.staffId} was not found`)
  }

  const endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60 * 1000)
  const [queueConflict, blockedConflict] = await Promise.all([
    prisma.queueItem.findFirst({
      where: {
        shopId: shop.id,
        staffId: staff.id,
        status: { in: [...activeBarberStatuses] },
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { id: true, queueNumber: true },
    }),
    prisma.blockedTime.findFirst({
      where: {
        shopId: shop.id,
        staffId: staff.id,
        startsAt: { lt: endsAt },
        endsAt: { gt: startsAt },
      },
      select: { id: true },
    }),
  ])

  if (queueConflict) {
    throw new HttpError(409, 'APPOINTMENT_CONFLICT', 'Appointment overlaps an active queue item', {
      queueItemId: queueConflict.id,
      queueNumber: queueConflict.queueNumber,
    })
  }

  if (blockedConflict) {
    throw new HttpError(409, 'BLOCKED_TIME_CONFLICT', 'Appointment overlaps blocked time', {
      blockedTimeId: blockedConflict.id,
    })
  }

  return prisma.$transaction(async (tx) => {
    const queueNumber = await getNextQueueNumber(tx, shop.id, queueDate, 'A')
    const customer = await tx.customer.create({
      data: {
        shopId: shop.id,
        name: customerName,
        phone,
      },
      select: { id: true },
    })
    const queueItem = await tx.queueItem.create({
      data: {
        shopId: shop.id,
        queueNumber,
        queueDate,
        customerId: customer.id,
        serviceId: service.id,
        staffId: staff.id,
        source: 'online',
        status: 'confirmed',
        startsAt,
        endsAt,
        estimatedWaitMinutes: 0,
        queueAhead: 0,
        bookingCode: `DC-${formatBookingCodeTime(startsAt)}`,
        customerNote: input.customerNote?.trim() || null,
      },
      select: {
        id: true,
        queueNumber: true,
        source: true,
        status: true,
        bookingCode: true,
      },
    })

    return { queueItem }
  })
}

export const createCustomerTattooRequest = async (input: CreateTattooRequestInput) => {
  const customerName = requireText(input.customerName, 'customerName', 2)
  const phone = requireText(input.phone, 'phone', 1)
  const placement = requireText(input.placement, 'placement', 2)
  const sizeEstimate = requireText(input.sizeEstimate, 'sizeEstimate', 1)
  const description = requireText(input.description, 'description', 10)
  const queueDate = getQueueDate()

  if (!queueDate) {
    throw new HttpError(500, 'QUEUE_DATE_ERROR', 'Could not resolve queue date')
  }

  const shop = await getShopBySlug(input.shopSlug)
  const [service, staff, pendingTattooCount] = await Promise.all([
    prisma.service.findFirst({
      where: {
        shopId: shop.id,
        category: 'tattoo',
        isActive: true,
      },
      select: {
        id: true,
        durationMinutes: true,
      },
      orderBy: [{ createdAt: 'asc' }],
    }),
    prisma.staff.findFirst({
      where: {
        shopId: shop.id,
        role: 'tattoo_artist',
        isBookable: true,
        status: 'active',
      },
      select: {
        id: true,
      },
      orderBy: [{ createdAt: 'asc' }],
    }),
    prisma.queueItem.count({
      where: {
        shopId: shop.id,
        queueDate,
        source: 'tattoo',
        status: 'pending_review',
      },
    }),
  ])

  if (!service) {
    throw new HttpError(404, 'SERVICE_NOT_FOUND', 'Tattoo request service was not found')
  }

  if (!staff) {
    throw new HttpError(404, 'STAFF_NOT_FOUND', 'No active tattoo staff was found')
  }

  return prisma.$transaction(async (tx) => {
    const queueNumber = await getNextQueueNumber(tx, shop.id, queueDate, 'T')
    const customer = await tx.customer.create({
      data: {
        shopId: shop.id,
        name: customerName,
        phone,
      },
      select: { id: true, name: true, phone: true, lineId: true },
    })
    const tattooRequest = await tx.tattooRequest.create({
      data: {
        shopId: shop.id,
        queueNumber,
        customerId: customer.id,
        preferredStaffId: staff.id,
        status: 'pending_review',
        placement,
        sizeEstimate,
        budgetEstimate: input.budgetEstimate?.trim() || null,
        preferredDateText: input.preferredDateText?.trim() || null,
        description,
      },
      select: {
        id: true,
        queueNumber: true,
        status: true,
      },
    })

    if (input.referenceImageNames && input.referenceImageNames.length > 0) {
      await tx.referenceImage.createMany({
        data: input.referenceImageNames.map((fileName) => ({
          shopId: shop.id,
          tattooRequestId: tattooRequest.id,
          url: `/tattoo-references/${fileName}`,
          fileName,
          mimeType: 'image/*',
          sizeBytes: 0,
        })),
      })
    }

    const now = new Date()
    const queueItem = await tx.queueItem.create({
      data: {
        shopId: shop.id,
        queueNumber,
        queueDate,
        customerId: customer.id,
        serviceId: service.id,
        staffId: staff.id,
        source: 'tattoo',
        status: 'pending_review',
        startsAt: null,
        endsAt: null,
        estimatedWaitMinutes: 0,
        queueAhead: pendingTattooCount,
        bookingCode: `TR-${queueNumber.slice(1)}`,
        customerNote: description,
        tattooRequestId: tattooRequest.id,
        createdAt: now,
      },
      select: {
        id: true,
        queueNumber: true,
        source: true,
        status: true,
        bookingCode: true,
      },
    })

    return {
      tattooRequest,
      queueItem,
    }
  })
}
