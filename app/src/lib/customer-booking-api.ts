import { apiRequest } from './api-client'
import type { QueueItem, QueueStatus, Service } from './mock-data'

type QueueItemSummary = {
  id: string
  queueNumber: string
  source: 'online' | 'walk_in' | 'admin' | 'tattoo'
  status: QueueStatus
  bookingCode: string
  estimatedWaitMinutes?: number
  queueAhead?: number
}

type CreateQueueTicketResponse = {
  queueItem: QueueItemSummary & {
    estimatedWaitMinutes: number
    queueAhead: number
  }
}

type CreateAppointmentResponse = {
  queueItem: QueueItemSummary
}

type CreateTattooRequestResponse = {
  tattooRequest: {
    id: string
    queueNumber: string
    status: 'pending_review' | 'contacted' | 'confirmed' | 'cancelled'
  }
  queueItem: QueueItemSummary
}

type CreateQueueTicketInput = {
  service: Service
  customerName?: string
  phone?: string
  customerNote?: string
}

type CreateAppointmentInput = {
  service: Service
  staffId?: string
  dateValue: string
  slot: string
  customerName: string
  phone: string
  customerNote?: string
}

type CreateTattooRequestInput = {
  customerName: string
  phone: string
  placement: string
  sizeEstimate: string
  budgetEstimate?: string
  preferredDateText?: string
  description: string
  referenceImageNames?: string[]
}

const serviceIdMap: Record<string, string> = {
  'classic-haircut': 'service_classic_haircut',
  'modern-fade': 'service_modern_fade',
  'beard-trim': 'service_beard_trim',
}

const toApiServiceId = (serviceId: string) => serviceIdMap[serviceId] ?? serviceId

export const toBangkokSlotIso = (dateValue: string, slot: string) => {
  return new Date(`${dateValue}T${slot}:00+07:00`).toISOString()
}

export const mapTicketResponseToQueueItem = (queueItem: CreateQueueTicketResponse['queueItem'], service: Service): QueueItem => {
  return {
    id: queueItem.id,
    queueNumber: queueItem.queueNumber,
    time: 'ตอนนี้',
    endTime: 'รอเรียก',
    customer: 'ลูกค้าหน้าร้าน',
    phone: '-',
    service: service.name,
    staff: 'Arm',
    source: queueItem.source,
    status: queueItem.status,
    duration: service.duration,
    estimatedWaitMinutes: queueItem.estimatedWaitMinutes,
    queueAhead: queueItem.queueAhead,
    bookingCode: queueItem.bookingCode,
    note: 'รับบัตรคิวจากหน้าลูกค้า',
  }
}

export const mapTattooResponseToQueueItem = (response: CreateTattooRequestResponse, input: CreateTattooRequestInput): QueueItem => {
  return {
    id: response.queueItem.id,
    queueNumber: response.queueItem.queueNumber,
    time: input.preferredDateText?.trim() || 'รอร้านติดต่อ',
    endTime: 'รอประเมิน',
    customer: input.customerName.trim(),
    phone: input.phone.trim(),
    service: 'Tattoo request',
    staff: 'Boss',
    source: 'tattoo',
    status: response.queueItem.status,
    duration: 'รอประเมิน',
    estimatedWaitMinutes: 0,
    queueAhead: response.queueItem.queueAhead ?? 0,
    bookingCode: response.queueItem.bookingCode,
    note: [
      input.description.trim(),
      input.placement.trim() ? `ตำแหน่ง: ${input.placement.trim()}` : null,
      input.sizeEstimate ? `ขนาด: ${input.sizeEstimate}` : null,
      input.budgetEstimate?.trim() ? `งบ: ${input.budgetEstimate.trim()}` : null,
    ]
      .filter(Boolean)
      .join(' · '),
  }
}

export const createCustomerQueueTicket = async (input: CreateQueueTicketInput) => {
  const response = await apiRequest<CreateQueueTicketResponse>('/shops/dream-catcher/queue/tickets', {
    method: 'POST',
    body: {
      serviceId: toApiServiceId(input.service.id),
      customerName: input.customerName ?? 'ลูกค้าหน้าร้าน',
      phone: input.phone ?? '-',
      customerNote: input.customerNote ?? 'รับบัตรคิวจากหน้าลูกค้า',
    },
  })

  return mapTicketResponseToQueueItem(response.queueItem, input.service)
}

export const createCustomerAppointment = async (input: CreateAppointmentInput) => {
  return apiRequest<CreateAppointmentResponse>('/shops/dream-catcher/appointments', {
    method: 'POST',
    body: {
      serviceId: toApiServiceId(input.service.id),
      staffId: input.staffId ?? 'staff_arm',
      startsAt: toBangkokSlotIso(input.dateValue, input.slot),
      customerName: input.customerName,
      phone: input.phone,
      customerNote: input.customerNote,
    },
  })
}

export const createCustomerTattooRequest = async (input: CreateTattooRequestInput) => {
  const response = await apiRequest<CreateTattooRequestResponse>('/shops/dream-catcher/tattoo-requests', {
    method: 'POST',
    body: {
      customerName: input.customerName,
      phone: input.phone,
      placement: input.placement,
      sizeEstimate: input.sizeEstimate,
      budgetEstimate: input.budgetEstimate,
      preferredDateText: input.preferredDateText,
      description: input.description,
      referenceImageNames: input.referenceImageNames,
    },
  })

  return {
    tattooRequest: response.tattooRequest,
    queueItem: mapTattooResponseToQueueItem(response, input),
  }
}
