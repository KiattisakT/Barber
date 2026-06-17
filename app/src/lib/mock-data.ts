export type ServiceCategory = 'barber' | 'tattoo'
export type QueueStatus = 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'pending_review' | 'cancelled' | 'no_show'

export type Service = {
  id: string
  category: ServiceCategory
  name: string
  description: string
  price: string
  duration: string
  image: string
}

export type QueueItem = {
  id: string
  queueNumber: string
  time: string
  endTime: string
  customer: string
  phone: string
  service: string
  staff: string
  source: 'online' | 'walk_in' | 'tattoo'
  status: QueueStatus
  duration: string
  estimatedWaitMinutes: number
  queueAhead: number
  bookingCode: string
  note: string
}

export type BlockedTime = {
  id: string
  time: string
  reason: string
  staff: string
}

export const barberServices: Service[] = [
  {
    id: 'classic-haircut',
    category: 'barber',
    name: 'ตัดผมชาย',
    description: 'ทรงคลาสสิก เก็บรายละเอียดท้ายทอยและจอน',
    price: '฿250',
    duration: '45 นาที',
    image: '/ui-assets/services/service-classic-haircut.png',
  },
  {
    id: 'modern-fade',
    category: 'barber',
    name: 'Fade / Modern cut',
    description: 'เฟดเรียบ คุมทรงให้เข้ากับรูปหน้า',
    price: '฿350',
    duration: '60 นาที',
    image: '/ui-assets/services/service-modern-fade.png',
  },
  {
    id: 'beard-trim',
    category: 'barber',
    name: 'แต่งหนวดเครา',
    description: 'จัดทรงเคราและเก็บเส้นให้สะอาด',
    price: '฿180',
    duration: '30 นาที',
    image: '/ui-assets/services/service-beard-trim.png',
  },
]

export const queueItems: QueueItem[] = [
  {
    id: 'q1',
    queueNumber: 'A018',
    time: '10:30',
    endTime: '11:15',
    customer: 'คุณนนท์',
    phone: '089-742-3194',
    service: 'ตัดผมชาย',
    staff: 'Arm',
    source: 'online',
    status: 'completed',
    duration: '45 นาที',
    estimatedWaitMinutes: 0,
    queueAhead: 0,
    bookingCode: 'DC-1030',
    note: 'ขอเก็บทรงเดิมให้สั้นลง',
  },
  {
    id: 'q2',
    queueNumber: 'A022',
    time: '11:15',
    endTime: '12:15',
    customer: 'ลูกค้าหน้าร้าน',
    phone: '-',
    service: 'Modern fade',
    staff: 'Arm',
    source: 'walk_in',
    status: 'in_progress',
    duration: '60 นาที',
    estimatedWaitMinutes: 0,
    queueAhead: 0,
    bookingCode: 'WI-1115',
    note: 'รออยู่หน้าร้านแล้ว',
  },
  {
    id: 'q3',
    queueNumber: 'T007',
    time: '13:00',
    endTime: '13:30',
    customer: 'คุณมายด์',
    phone: '081-205-7746',
    service: 'Tattoo consult',
    staff: 'Boss',
    source: 'tattoo',
    status: 'pending_review',
    duration: '30 นาที',
    estimatedWaitMinutes: 45,
    queueAhead: 1,
    bookingCode: 'TR-1300',
    note: 'fineline floral, ต้นแขน, งบประมาณ 2,500-3,500',
  },
  {
    id: 'q4',
    queueNumber: 'A023',
    time: '14:30',
    endTime: '15:15',
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
  },
  {
    id: 'q5',
    queueNumber: 'A024',
    time: '16:00',
    endTime: '17:00',
    customer: 'คุณแพรว',
    phone: '092-384-6175',
    service: 'Modern fade',
    staff: 'Arm',
    source: 'online',
    status: 'confirmed',
    duration: '60 นาที',
    estimatedWaitMinutes: 60,
    queueAhead: 13,
    bookingCode: 'DC-1600',
    note: 'ต้องการทรงสุภาพสำหรับสัมภาษณ์งาน',
  },
]

export const timeSlots = ['10:00', '10:45', '11:30', '13:00', '13:45', '14:30', '16:00', '17:30']

export const blockedTimes: BlockedTime[] = [
  { id: 'b1', time: '12:15-13:00', reason: 'พักกลางวัน / เคลียร์อุปกรณ์', staff: 'Arm' },
  { id: 'b2', time: '17:00-18:30', reason: 'งานสักยาวที่ต้อง confirm', staff: 'Boss' },
]
