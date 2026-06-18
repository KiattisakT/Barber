import type { QueueItem, QueueStatus } from './mock-data'

export const statusText: Record<QueueStatus, string> = {
  confirmed: 'ยืนยันแล้ว',
  checked_in: 'มาถึงแล้ว',
  in_progress: 'กำลังให้บริการ',
  completed: 'เสร็จแล้ว',
  pending_review: 'รอ review',
  contacted: 'ติดต่อแล้ว',
  cancelled: 'ยกเลิก',
  no_show: 'ไม่มาตามนัด',
}

export const statusClass: Record<QueueStatus, string> = {
  confirmed: 'border-confirmed/30 bg-confirmed/10 text-confirmed',
  checked_in: 'border-waiting/30 bg-waiting/10 text-waiting',
  in_progress: 'border-in-progress/30 bg-in-progress/10 text-in-progress',
  completed: 'border-completed/30 bg-completed/10 text-completed',
  pending_review: 'border-copper/30 bg-copper/10 text-copper-dark',
  contacted: 'border-copper/30 bg-copper/10 text-copper-dark',
  cancelled: 'border-cancelled/30 bg-cancelled/10 text-cancelled',
  no_show: 'border-no-show/30 bg-no-show/10 text-no-show',
}

export const statusToneClass: Record<QueueStatus, string> = {
  confirmed: 'border-l-confirmed',
  checked_in: 'border-l-waiting',
  in_progress: 'border-l-in-progress',
  completed: 'border-l-completed',
  pending_review: 'border-l-copper',
  contacted: 'border-l-copper',
  cancelled: 'border-l-cancelled',
  no_show: 'border-l-no-show',
}

export const sourceText: Record<QueueItem['source'], string> = {
  online: 'online',
  walk_in: 'walk-in',
  admin: 'admin',
  tattoo: 'tattoo',
}

export const nextStatus: Partial<Record<QueueStatus, QueueStatus>> = {
  confirmed: 'checked_in',
  checked_in: 'in_progress',
  in_progress: 'completed',
  pending_review: 'contacted',
  contacted: 'confirmed',
}

export const nextStatusText: Partial<Record<QueueStatus, string>> = {
  confirmed: 'เช็กอิน',
  checked_in: 'เริ่มบริการ',
  in_progress: 'ปิดคิว',
  pending_review: 'ติดต่อแล้ว',
  contacted: 'ยืนยันนัด',
}
