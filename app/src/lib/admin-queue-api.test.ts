import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAdminBlockedTime, createAdminWalkIn, mapApiBlockedTimeToBlockedTime, mapApiQueueItemToQueueItem, type AdminQueueApiItem } from './admin-queue-api'

const queueItem: AdminQueueApiItem = {
  id: 'queue_a023',
  queueNumber: 'A023',
  customer: {
    name: 'คุณบอล',
    phone: '086-441-5082',
  },
  service: {
    name: 'แต่งหนวดเครา',
    category: 'barber',
    durationMinutes: 45,
  },
  staff: {
    name: 'Arm',
  },
  source: 'online',
  status: 'checked_in',
  startsAt: '2026-06-17T07:30:00.000Z',
  endsAt: '2026-06-17T08:15:00.000Z',
  estimatedWaitMinutes: 45,
  queueAhead: 12,
  bookingCode: 'DC-1430',
  customerNote: 'มาก่อนเวลา นั่งรอในร้าน',
  internalNote: null,
}

describe('admin queue api', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })
  it('maps queue API DTO to UI queue item', () => {
    const mapped = mapApiQueueItemToQueueItem(queueItem)

    expect(mapped).toMatchObject({
      id: 'queue_a023',
      queueNumber: 'A023',
      customer: 'คุณบอล',
      phone: '086-441-5082',
      service: 'แต่งหนวดเครา',
      staff: 'Arm',
      source: 'online',
      status: 'checked_in',
      duration: '45 นาที',
      estimatedWaitMinutes: 45,
      queueAhead: 12,
      bookingCode: 'DC-1430',
      note: 'มาก่อนเวลา นั่งรอในร้าน',
    })
  })

  it('uses tattoo pending fallbacks when queue has no time', () => {
    const mapped = mapApiQueueItemToQueueItem({
      ...queueItem,
      source: 'tattoo',
      status: 'pending_review',
      startsAt: null,
      endsAt: null,
      customerNote: null,
      internalNote: 'รอ review',
    })

    expect(mapped.time).toBe('รอร้านติดต่อ')
    expect(mapped.endTime).toBe('รอประเมิน')
    expect(mapped.note).toBe('รอ review')
  })

  it('maps blocked time API DTO to UI blocked time', () => {
    const mapped = mapApiBlockedTimeToBlockedTime({
      id: 'blocked_lunch',
      staffName: 'Arm',
      startsAt: '2026-06-17T05:15:00.000Z',
      endsAt: '2026-06-17T06:00:00.000Z',
      reason: 'พักกลางวัน / เคลียร์อุปกรณ์',
    })

    expect(mapped).toMatchObject({
      id: 'blocked_lunch',
      reason: 'พักกลางวัน / เคลียร์อุปกรณ์',
      staff: 'Arm',
    })
    expect(mapped.time).toContain('-')
  })


  it('posts admin walk-in payload with mapped service id', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ queueItem: { queueNumber: 'A025' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await createAdminWalkIn({
      serviceId: 'classic-haircut',
      customerName: 'ลูกค้าหน้าร้าน',
      phone: '-',
      internalNote: 'เพิ่มจาก test',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/walk-ins', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        shopSlug: 'dream-catcher',
        serviceId: 'service_classic_haircut',
        staffId: 'staff_arm',
        customerName: 'ลูกค้าหน้าร้าน',
        phone: '-',
        internalNote: 'เพิ่มจาก test',
      }),
    }))
  })

  it('posts admin blocked time payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ blockedTime: { id: 'blocked_test' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await createAdminBlockedTime({
      startsAt: '2026-06-17T11:30:00.000Z',
      endsAt: '2026-06-17T12:00:00.000Z',
      reason: 'พัก/เคลียร์อุปกรณ์',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/admin/blocked-times', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        shopSlug: 'dream-catcher',
        staffId: 'staff_arm',
        startsAt: '2026-06-17T11:30:00.000Z',
        endsAt: '2026-06-17T12:00:00.000Z',
        reason: 'พัก/เคลียร์อุปกรณ์',
      }),
    }))
  })

})
