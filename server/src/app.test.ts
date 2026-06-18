import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { app } from './app.js'
import { createAdminBlockedTime, createAdminWalkIn } from './services/admin-mutation-service.js'
import { getAdminQueueToday } from './services/admin-queue-service.js'
import { createCustomerAppointment, createCustomerQueueTicket, createCustomerTattooRequest, getPublicQueueToday, getPublicShop } from './services/public-shop-service.js'
import { updateQueueItemStatus } from './services/queue-status-service.js'

vi.mock('./prisma-client.js', () => ({
  prisma: {},
}))

vi.mock('./services/admin-queue-service.js', () => ({
  getAdminQueueToday: vi.fn(),
}))

vi.mock('./services/queue-status-service.js', async () => {
  const actual = await vi.importActual<typeof import('./services/queue-status-service.js')>('./services/queue-status-service.js')

  return {
    ...actual,
    updateQueueItemStatus: vi.fn(),
  }
})

vi.mock('./services/admin-mutation-service.js', () => ({
  createAdminWalkIn: vi.fn(),
  createAdminBlockedTime: vi.fn(),
}))

vi.mock('./services/public-shop-service.js', () => ({
  getPublicShop: vi.fn(),
  getPublicQueueToday: vi.fn(),
  createCustomerQueueTicket: vi.fn(),
  createCustomerAppointment: vi.fn(),
  createCustomerTattooRequest: vi.fn(),
}))

const mockedGetAdminQueueToday = vi.mocked(getAdminQueueToday)
const mockedUpdateQueueItemStatus = vi.mocked(updateQueueItemStatus)
const mockedCreateAdminWalkIn = vi.mocked(createAdminWalkIn)
const mockedCreateAdminBlockedTime = vi.mocked(createAdminBlockedTime)
const mockedGetPublicShop = vi.mocked(getPublicShop)
const mockedGetPublicQueueToday = vi.mocked(getPublicQueueToday)
const mockedCreateCustomerQueueTicket = vi.mocked(createCustomerQueueTicket)
const mockedCreateCustomerAppointment = vi.mocked(createCustomerAppointment)
const mockedCreateCustomerTattooRequest = vi.mocked(createCustomerTattooRequest)

describe('app routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns health status', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      ok: true,
      service: 'dream-catcher-server',
      env: 'test',
    })
  })


  it('returns public shop payload', async () => {
    mockedGetPublicShop.mockResolvedValueOnce({
      shop: {
        id: 'shop_dream_catcher',
        slug: 'dream-catcher',
        displayName: 'Dream Catcher Barber & Tattoo',
        phone: null,
        address: 'San Kamphaeng, Chiang Mai',
        mapUrl: null,
        timezone: 'Asia/Bangkok',
        status: 'active',
        todayHours: {
          opensAt: '10:00',
          closesAt: '20:00',
          isClosed: false,
        },
      },
      services: [],
    })

    const response = await request(app).get('/api/shops/dream-catcher/public')

    expect(response.status).toBe(200)
    expect(response.body.shop.slug).toBe('dream-catcher')
    expect(mockedGetPublicShop).toHaveBeenCalledWith('dream-catcher')
  })

  it('returns public queue today payload', async () => {
    mockedGetPublicQueueToday.mockResolvedValueOnce({
      date: '2026-06-17',
      activeQueueCount: 3,
      pendingTattooCount: 1,
      nextQueueNumber: 'A025',
      estimatedWaitMinutes: 105,
      queueAhead: 3,
      current: {
        queueNumber: 'A022',
        status: 'in_progress',
      },
      myQueue: null,
    })

    const response = await request(app).get('/api/shops/dream-catcher/queue/today?date=2026-06-17&bookingCode=QT-A025')

    expect(response.status).toBe(200)
    expect(response.body.nextQueueNumber).toBe('A025')
    expect(mockedGetPublicQueueToday).toHaveBeenCalledWith('dream-catcher', new Date('2026-06-17T00:00:00.000Z'), {
      bookingCode: 'QT-A025',
      queueNumber: undefined,
    })
  })

  it('rejects invalid public queue date', async () => {
    const response = await request(app).get('/api/shops/dream-catcher/queue/today?date=bad')

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    expect(mockedGetPublicQueueToday).not.toHaveBeenCalled()
  })

  it('creates customer queue ticket', async () => {
    mockedCreateCustomerQueueTicket.mockResolvedValueOnce({
      queueItem: {
        id: 'queue_a025',
        queueNumber: 'A025',
        source: 'walk_in',
        status: 'checked_in',
        estimatedWaitMinutes: 105,
        queueAhead: 3,
        bookingCode: 'QT-A025',
      },
    })

    const requestBody = {
      serviceId: 'service_classic_haircut',
      customerName: 'ลูกค้าหน้าร้าน',
      phone: '-',
      customerNote: 'รับบัตรคิวจากหน้าลูกค้า',
    }

    const response = await request(app).post('/api/shops/dream-catcher/queue/tickets').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body.queueItem.bookingCode).toBe('QT-A025')
    expect(mockedCreateCustomerQueueTicket).toHaveBeenCalledWith({
      shopSlug: 'dream-catcher',
      ...requestBody,
    })
  })

  it('rejects customer queue ticket without service', async () => {
    const response = await request(app).post('/api/shops/dream-catcher/queue/tickets').send({ customerName: 'ลูกค้าหน้าร้าน' })

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    expect(mockedCreateCustomerQueueTicket).not.toHaveBeenCalled()
  })


  it('creates customer appointment', async () => {
    mockedCreateCustomerAppointment.mockResolvedValueOnce({
      queueItem: {
        id: 'queue_a026',
        queueNumber: 'A026',
        source: 'online',
        status: 'confirmed',
        bookingCode: 'DC-0930',
      },
    })

    const requestBody = {
      serviceId: 'service_modern_fade',
      staffId: 'staff_arm',
      startsAt: '2026-06-18T09:30:00.000Z',
      customerName: 'คุณต้น',
      phone: '0891234567',
      customerNote: 'ขอช่างที่ถนัด fade',
    }

    const response = await request(app).post('/api/shops/dream-catcher/appointments').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body.queueItem.status).toBe('confirmed')
    expect(mockedCreateCustomerAppointment).toHaveBeenCalledWith({
      shopSlug: 'dream-catcher',
      ...requestBody,
    })
  })

  it('creates customer tattoo request', async () => {
    mockedCreateCustomerTattooRequest.mockResolvedValueOnce({
      tattooRequest: {
        id: 'tattoo_request_t008',
        queueNumber: 'T008',
        status: 'pending_review',
      },
      queueItem: {
        id: 'queue_t008',
        queueNumber: 'T008',
        source: 'tattoo',
        status: 'pending_review',
        bookingCode: 'TR-008',
      },
    })

    const requestBody = {
      customerName: 'คุณมายด์',
      phone: '0812057746',
      placement: 'ต้นแขนด้านใน',
      sizeEstimate: 'เล็ก ประมาณ 5-8 ซม.',
      budgetEstimate: '2,500-3,500',
      preferredDateText: 'เสาร์หน้า / หลัง 18:00',
      description: 'fineline ดอกไม้เล็ก ๆ โทนเรียบ',
      referenceImageNames: ['rose-reference.png'],
    }

    const response = await request(app).post('/api/shops/dream-catcher/tattoo-requests').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body.tattooRequest.status).toBe('pending_review')
    expect(mockedCreateCustomerTattooRequest).toHaveBeenCalledWith({
      shopSlug: 'dream-catcher',
      ...requestBody,
    })
  })

  it('returns admin queue today payload', async () => {
    mockedGetAdminQueueToday.mockResolvedValueOnce({
      date: '2026-06-17',
      shop: {
        id: 'shop_dream_catcher',
        slug: 'dream-catcher',
        displayName: 'Dream Catcher Barber & Tattoo',
        timezone: 'Asia/Bangkok',
      },
      items: [],
      blockedTimes: [],
      summary: {
        activeCount: 0,
        checkedInCount: 0,
        pendingTattooCount: 0,
        inProgressQueueNumber: null,
      },
    })

    const response = await request(app).get('/api/admin/shops/dream-catcher/queue/today?date=2026-06-17')

    expect(response.status).toBe(200)
    expect(response.body.summary.activeCount).toBe(0)
    expect(mockedGetAdminQueueToday).toHaveBeenCalledWith('dream-catcher', new Date('2026-06-17T00:00:00.000Z'))
  })

  it('rejects invalid admin queue date', async () => {
    const response = await request(app).get('/api/admin/shops/dream-catcher/queue/today?date=bad')

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    expect(mockedGetAdminQueueToday).not.toHaveBeenCalled()
  })

  it('updates queue status', async () => {
    mockedUpdateQueueItemStatus.mockResolvedValueOnce({
      queueItem: {
        id: 'queue_a023',
        status: 'in_progress',
        updatedAt: '2026-06-17T00:00:00.000Z',
      },
      affectedItems: [{ id: 'queue_a022', status: 'checked_in' }],
    })

    const response = await request(app)
      .patch('/api/admin/queue-items/queue_a023/status')
      .send({ status: 'in_progress' })

    expect(response.status).toBe(200)
    expect(response.body.affectedItems).toEqual([{ id: 'queue_a022', status: 'checked_in' }])
    expect(mockedUpdateQueueItemStatus).toHaveBeenCalledWith('queue_a023', 'in_progress')
  })

  it('rejects invalid queue status', async () => {
    const response = await request(app)
      .patch('/api/admin/queue-items/queue_a023/status')
      .send({ status: 'bad_status' })

    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
    expect(mockedUpdateQueueItemStatus).not.toHaveBeenCalled()
  })

  it('creates admin walk-in', async () => {
    mockedCreateAdminWalkIn.mockResolvedValueOnce({
      queueItem: {
        id: 'queue_a025',
        queueNumber: 'A025',
        source: 'walk_in',
        status: 'checked_in',
        bookingCode: 'WI-A025',
        estimatedWaitMinutes: 150,
        queueAhead: 3,
      },
    })

    const requestBody = {
      shopSlug: 'dream-catcher',
      serviceId: 'service_classic_haircut',
      staffId: 'staff_arm',
      customerName: 'คุณทดสอบ',
      phone: '080-000-0000',
      internalNote: 'test walk-in',
    }

    const response = await request(app).post('/api/admin/walk-ins').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body.queueItem.queueNumber).toBe('A025')
    expect(mockedCreateAdminWalkIn).toHaveBeenCalledWith(requestBody)
  })

  it('creates admin blocked time', async () => {
    mockedCreateAdminBlockedTime.mockResolvedValueOnce({
      blockedTime: {
        id: 'blocked_test',
        shopId: 'shop_dream_catcher',
        staffId: 'staff_arm',
        startsAt: '2026-06-17T11:30:00.000Z',
        endsAt: '2026-06-17T12:00:00.000Z',
        reason: 'ทดสอบ block เวลา',
        createdAt: '2026-06-17T00:00:00.000Z',
      },
    })

    const requestBody = {
      shopSlug: 'dream-catcher',
      staffId: 'staff_arm',
      startsAt: '2026-06-17T11:30:00.000Z',
      endsAt: '2026-06-17T12:00:00.000Z',
      reason: 'ทดสอบ block เวลา',
    }

    const response = await request(app).post('/api/admin/blocked-times').send(requestBody)

    expect(response.status).toBe(201)
    expect(response.body.blockedTime.id).toBe('blocked_test')
    expect(mockedCreateAdminBlockedTime).toHaveBeenCalledWith(requestBody)
  })
})
