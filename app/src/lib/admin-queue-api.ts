import { appConfig } from './app-config'
import { apiRequest } from './api-client'
import type { BlockedTime, QueueItem, QueueStatus } from './mock-data'

export type AdminQueueApiItem = {
  id: string
  queueNumber: string
  customer: {
    name: string
    phone: string
  }
  service: {
    name: string
    category: 'barber' | 'tattoo'
    durationMinutes: number
  }
  staff: {
    name: string
  }
  source: 'online' | 'walk_in' | 'admin' | 'tattoo'
  status: QueueStatus
  startsAt: string | null
  endsAt: string | null
  estimatedWaitMinutes: number
  queueAhead: number
  bookingCode: string
  customerNote: string | null
  internalNote: string | null
}

export type AdminQueueApiBlockedTime = {
  id: string
  staffName: string
  startsAt: string
  endsAt: string
  reason: string
}

type AdminQueueTodayResponse = {
  date: string
  items: AdminQueueApiItem[]
  blockedTimes: AdminQueueApiBlockedTime[]
}



type CreateAdminWalkInInput = {
  serviceId: string
  customerName: string
  phone?: string
  internalNote?: string
}

type CreateBlockedTimeInput = {
  startsAt: string
  endsAt: string
  reason: string
  staffId?: string
}

const serviceIdMap: Record<string, string> = {
  'classic-haircut': 'service_classic_haircut',
  'modern-fade': 'service_modern_fade',
  'beard-trim': 'service_beard_trim',
}

const toApiServiceId = (serviceId: string) => serviceIdMap[serviceId] ?? serviceId

type UpdateQueueStatusResponse = {
  queueItem: {
    id: string
    status: QueueStatus
    updatedAt: string
  }
  affectedItems: Array<{ id: string; status: QueueStatus }>
}

const timeFormatter = new Intl.DateTimeFormat('th-TH', {
  timeZone: 'Asia/Bangkok',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const formatTime = (value: string | null, fallback: string) => {
  if (!value) return fallback

  return timeFormatter.format(new Date(value)).replace('.', ':')
}

const formatDuration = (minutes: number) => `${minutes} นาที`

export const mapApiQueueItemToQueueItem = (item: AdminQueueApiItem): QueueItem => {
  return {
    id: item.id,
    queueNumber: item.queueNumber,
    time: formatTime(item.startsAt, item.status === 'pending_review' ? 'รอร้านติดต่อ' : 'ตอนนี้'),
    endTime: formatTime(item.endsAt, item.status === 'pending_review' ? 'รอประเมิน' : 'รอเรียก'),
    customer: item.customer.name,
    phone: item.customer.phone,
    service: item.service.name,
    staff: item.staff.name,
    source: item.source,
    status: item.status,
    duration: formatDuration(item.service.durationMinutes),
    estimatedWaitMinutes: item.estimatedWaitMinutes,
    queueAhead: item.queueAhead,
    bookingCode: item.bookingCode,
    note: item.customerNote ?? item.internalNote ?? '-',
  }
}

export const mapApiBlockedTimeToBlockedTime = (blockedTime: AdminQueueApiBlockedTime): BlockedTime => {
  return {
    id: blockedTime.id,
    time: `${formatTime(blockedTime.startsAt, '-')}-${formatTime(blockedTime.endsAt, '-')}`,
    reason: blockedTime.reason,
    staff: blockedTime.staffName,
  }
}

export const fetchAdminQueueToday = async (shopSlug = appConfig.shopSlug) => {
  const queueDate = appConfig.queueDate
  const response = await apiRequest<AdminQueueTodayResponse>(`/admin/shops/${shopSlug}/queue/today?date=${queueDate}`)

  return {
    items: response.items.map(mapApiQueueItemToQueueItem),
    blockedTimes: response.blockedTimes.map(mapApiBlockedTimeToBlockedTime),
  }
}

export const updateAdminQueueItemStatus = async (id: string, status: QueueStatus) => {
  return apiRequest<UpdateQueueStatusResponse>(`/admin/queue-items/${id}/status`, {
    method: 'PATCH',
    body: { status },
  })
}

export const createAdminWalkIn = async (input: CreateAdminWalkInInput) => {
  return apiRequest('/admin/walk-ins', {
    method: 'POST',
    body: {
      shopSlug: appConfig.shopSlug,
      serviceId: toApiServiceId(input.serviceId),
      staffId: appConfig.defaultStaffId,
      customerName: input.customerName,
      phone: input.phone ?? '-',
      internalNote: input.internalNote,
    },
  })
}

export const createAdminBlockedTime = async (input: CreateBlockedTimeInput) => {
  return apiRequest('/admin/blocked-times', {
    method: 'POST',
    body: {
      shopSlug: appConfig.shopSlug,
      staffId: input.staffId ?? appConfig.defaultStaffId,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      reason: input.reason,
    },
  })
}
