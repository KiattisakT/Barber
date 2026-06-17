import type { QueueItem, QueueStatus } from './mock-data'

export type QueueView = 'all' | 'active' | 'needs_action'

export const terminalQueueStatuses: QueueStatus[] = ['completed', 'cancelled', 'no_show']

export const isTerminalQueueStatus = (status: QueueStatus) => {
  return terminalQueueStatuses.includes(status)
}

export const getActiveQueueItems = (items: QueueItem[]) => {
  return items.filter((item) => !isTerminalQueueStatus(item.status))
}

export const getPendingTattooItems = (items: QueueItem[]) => {
  return items.filter((item) => item.status === 'pending_review')
}

export const getCheckedInItems = (items: QueueItem[]) => {
  return items.filter((item) => item.status === 'checked_in')
}

export const getInProgressItem = (items: QueueItem[]) => {
  return items.find((item) => item.status === 'in_progress')
}

export const getNextCustomer = (items: QueueItem[]) => {
  return getCheckedInItems(items)[0] ?? items.find((item) => item.status === 'confirmed')
}

export const getVisibleQueueItems = (items: QueueItem[], view: QueueView) => {
  if (view === 'needs_action') {
    return items.filter((item) => ['checked_in', 'pending_review'].includes(item.status))
  }

  if (view === 'active') {
    return getActiveQueueItems(items)
  }

  return items
}

export const getQueueItemByNumber = (items: QueueItem[], queueNumber: string) => {
  return items.find((item) => item.queueNumber === queueNumber)
}

export const getNextQueueNumber = (items: QueueItem[], prefix = 'A') => {
  const maxNumber = items.reduce((max, item) => {
    if (!item.queueNumber.startsWith(prefix)) {
      return max
    }

    const number = Number.parseInt(item.queueNumber.slice(prefix.length), 10)
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 0)

  return `${prefix}${String(maxNumber + 1).padStart(3, '0')}`
}

export const transitionQueueStatus = (items: QueueItem[], id: string, status: QueueStatus): QueueItem[]  => {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, status }
    }

    if (status === 'in_progress' && item.status === 'in_progress') {
      return { ...item, status: 'checked_in' as QueueStatus }
    }

    return item
  })
}

export const createWalkInQueueItem = (items: QueueItem[], checkedInCount: number): QueueItem  => {
  const queueNumber = getNextQueueNumber(items, 'A')

  return {
    id: `walk-in-${Date.now()}`,
    queueNumber,
    time: 'ตอนนี้',
    endTime: 'คิวถัดไป',
    customer: 'ลูกค้าหน้าร้าน',
    phone: '-',
    service: 'ตัดผมชาย',
    staff: 'Arm',
    source: 'walk_in',
    status: 'checked_in',
    duration: '45 นาที',
    estimatedWaitMinutes: 30,
    queueAhead: checkedInCount,
    bookingCode: `WI-${queueNumber}`,
    note: 'เพิ่มจากหน้า admin mock',
  }
}
