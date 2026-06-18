import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createCustomerAppointment, createCustomerQueueTicket, createCustomerTattooRequest, toBangkokSlotIso } from './customer-booking-api'
import type { Service } from './mock-data'

const service: Service = {
  id: 'classic-haircut',
  category: 'barber',
  name: 'ตัดผมชาย',
  description: 'ทรงคลาสสิก',
  price: '฿250',
  duration: '45 นาที',
  image: '/service.png',
}

describe('customer booking api', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('formats Bangkok slot as ISO', () => {
    expect(toBangkokSlotIso('2026-06-18', '14:30')).toBe('2026-06-18T07:30:00.000Z')
  })

  it('posts customer queue ticket payload and maps response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ queueItem: { id: 'queue_a025', queueNumber: 'A025', source: 'walk_in', status: 'checked_in', bookingCode: 'QT-A025', estimatedWaitMinutes: 105, queueAhead: 3 } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const queueItem = await createCustomerQueueTicket({ service })

    expect(queueItem.queueNumber).toBe('A025')
    expect(queueItem.service).toBe('ตัดผมชาย')
    expect(fetchMock).toHaveBeenCalledWith('/api/shops/dream-catcher/queue/tickets', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ serviceId: 'service_classic_haircut', customerName: 'ลูกค้าหน้าร้าน', phone: '-', customerNote: 'รับบัตรคิวจากหน้าลูกค้า' }),
    }))
  })

  it('posts appointment payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ queueItem: { id: 'queue_a026', queueNumber: 'A026', source: 'online', status: 'confirmed', bookingCode: 'DC-1430' } }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await createCustomerAppointment({ service, dateValue: '2026-06-18', slot: '14:30', customerName: 'คุณต้น', phone: '0891234567' })

    expect(fetchMock).toHaveBeenCalledWith('/api/shops/dream-catcher/appointments', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ serviceId: 'service_classic_haircut', staffId: 'staff_arm', startsAt: '2026-06-18T07:30:00.000Z', customerName: 'คุณต้น', phone: '0891234567' }),
    }))
  })

  it('posts tattoo request payload and maps queue item', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({
        tattooRequest: { id: 'tattoo_request_t008', queueNumber: 'T008', status: 'pending_review' },
        queueItem: { id: 'queue_t008', queueNumber: 'T008', source: 'tattoo', status: 'pending_review', bookingCode: 'TR-008' },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await createCustomerTattooRequest({
      customerName: 'คุณมายด์',
      phone: '0812057746',
      placement: 'ต้นแขนด้านใน',
      sizeEstimate: 'เล็ก ประมาณ 5-8 ซม.',
      budgetEstimate: '2,500-3,500',
      preferredDateText: 'เสาร์หน้า',
      description: 'fineline ดอกไม้เล็ก ๆ โทนเรียบ',
      referenceImageNames: ['rose.png'],
    })

    expect(result.queueItem.queueNumber).toBe('T008')
    expect(result.queueItem.bookingCode).toBe('TR-008')
    expect(fetchMock).toHaveBeenCalledWith('/api/shops/dream-catcher/tattoo-requests', expect.objectContaining({ method: 'POST' }))
  })
})
