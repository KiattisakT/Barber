export type ServiceCategory = 'barber' | 'tattoo'
export type QueueStatus = 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'pending_review'

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
  time: string
  customer: string
  service: string
  staff: string
  source: 'online' | 'walk_in' | 'tattoo'
  status: QueueStatus
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
  { id: 'q1', time: '10:30', customer: 'คุณนนท์', service: 'ตัดผมชาย', staff: 'Arm', source: 'online', status: 'confirmed' },
  { id: 'q2', time: '11:15', customer: 'ลูกค้าหน้าร้าน', service: 'Modern fade', staff: 'Arm', source: 'walk_in', status: 'checked_in' },
  { id: 'q3', time: '13:00', customer: 'คุณมายด์', service: 'Tattoo consult', staff: 'Boss', source: 'tattoo', status: 'pending_review' },
  { id: 'q4', time: '15:30', customer: 'คุณบอล', service: 'แต่งหนวดเครา', staff: 'Arm', source: 'online', status: 'confirmed' },
]

export const timeSlots = ['10:00', '10:45', '11:30', '13:00', '13:45', '14:30', '16:00', '17:30']
