import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const shopId = 'shop_dream_catcher'
const staffArmId = 'staff_arm'
const staffBossId = 'staff_boss'
const serviceClassicHaircutId = 'service_classic_haircut'
const serviceModernFadeId = 'service_modern_fade'
const serviceBeardTrimId = 'service_beard_trim'
const serviceTattooConsultId = 'service_tattoo_consult'
const queueDate = new Date('2026-06-17T00:00:00.000Z')

const at = (time: string) => new Date(`2026-06-17T${time}:00.000+07:00`)

const main = async () => {
  await prisma.shop.deleteMany({ where: { id: shopId } })

  await prisma.shop.create({
    data: {
      id: shopId,
      slug: 'dream-catcher',
      name: 'Dream Catcher Barber and Tattoo',
      displayName: 'Dream Catcher Barber & Tattoo',
      address: 'San Kamphaeng, Chiang Mai',
      timezone: 'Asia/Bangkok',
      status: 'active',
    },
  })

  await prisma.staff.createMany({
    data: [
      {
        id: staffArmId,
        shopId,
        name: 'Arm',
        role: 'barber',
        isBookable: true,
        status: 'active',
      },
      {
        id: staffBossId,
        shopId,
        name: 'Boss',
        role: 'tattoo_artist',
        isBookable: true,
        status: 'active',
      },
    ],
  })

  await prisma.service.createMany({
    data: [
      {
        id: serviceClassicHaircutId,
        shopId,
        category: 'barber',
        name: 'ตัดผมชาย',
        description: 'ทรงคลาสสิก เก็บรายละเอียดท้ายทอยและจอน',
        priceLabel: '฿250',
        priceAmount: '250.00',
        durationMinutes: 45,
        bufferMinutes: 0,
        image: '/ui-assets/services/service-classic-haircut.png',
        isActive: true,
      },
      {
        id: serviceModernFadeId,
        shopId,
        category: 'barber',
        name: 'Fade / Modern cut',
        description: 'เฟดเรียบ คุมทรงให้เข้ากับรูปหน้า',
        priceLabel: '฿350',
        priceAmount: '350.00',
        durationMinutes: 60,
        bufferMinutes: 0,
        image: '/ui-assets/services/service-modern-fade.png',
        isActive: true,
      },
      {
        id: serviceBeardTrimId,
        shopId,
        category: 'barber',
        name: 'แต่งหนวดเครา',
        description: 'จัดทรงเคราและเก็บเส้นให้สะอาด',
        priceLabel: '฿180',
        priceAmount: '180.00',
        durationMinutes: 30,
        bufferMinutes: 0,
        image: '/ui-assets/services/service-beard-trim.png',
        isActive: true,
      },
      {
        id: serviceTattooConsultId,
        shopId,
        category: 'tattoo',
        name: 'Tattoo consult',
        description: 'ส่งไอเดียสักลายเพื่อให้ร้านประเมินก่อนยืนยันนัด',
        priceLabel: 'รอประเมิน',
        priceAmount: null,
        durationMinutes: 30,
        bufferMinutes: 0,
        image: '/ui-assets/services/service-tattoo-consult-rose.png',
        isActive: true,
      },
    ],
  })

  await prisma.customer.createMany({
    data: [
      { id: 'customer_non', shopId, name: 'คุณนนท์', phone: '089-742-3194' },
      { id: 'customer_walk_in', shopId, name: 'ลูกค้าหน้าร้าน', phone: '-' },
      { id: 'customer_mind', shopId, name: 'คุณมายด์', phone: '081-205-7746' },
      { id: 'customer_ball', shopId, name: 'คุณบอล', phone: '086-441-5082' },
      { id: 'customer_praew', shopId, name: 'คุณแพรว', phone: '092-384-6175' },
    ],
  })

  await prisma.tattooRequest.create({
    data: {
      id: 'tattoo_request_t007',
      shopId,
      queueNumber: 'T007',
      customerId: 'customer_mind',
      preferredStaffId: staffBossId,
      status: 'pending_review',
      placement: 'ต้นแขน',
      sizeEstimate: 'เล็ก ประมาณ 5-8 ซม.',
      budgetEstimate: '2,500-3,500',
      preferredDateText: 'วันนี้ช่วงบ่าย',
      description: 'fineline floral, ต้นแขน, งบประมาณ 2,500-3,500',
    },
  })

  await prisma.referenceImage.create({
    data: {
      id: 'reference_floral_fineline',
      shopId,
      tattooRequestId: 'tattoo_request_t007',
      url: '/ui-assets/tattoo-references/reference-floral-fineline.png',
      fileName: 'reference-floral-fineline.png',
      mimeType: 'image/png',
      sizeBytes: 0,
    },
  })

  await prisma.queueItem.createMany({
    data: [
      {
        id: 'queue_a018',
        shopId,
        queueNumber: 'A018',
        queueDate,
        customerId: 'customer_non',
        serviceId: serviceClassicHaircutId,
        staffId: staffArmId,
        source: 'online',
        status: 'completed',
        startsAt: at('10:30'),
        endsAt: at('11:15'),
        estimatedWaitMinutes: 0,
        queueAhead: 0,
        bookingCode: 'DC-1030',
        customerNote: 'ขอเก็บทรงเดิมให้สั้นลง',
      },
      {
        id: 'queue_a022',
        shopId,
        queueNumber: 'A022',
        queueDate,
        customerId: 'customer_walk_in',
        serviceId: serviceModernFadeId,
        staffId: staffArmId,
        source: 'walk_in',
        status: 'in_progress',
        startsAt: at('11:15'),
        endsAt: at('12:15'),
        estimatedWaitMinutes: 0,
        queueAhead: 0,
        bookingCode: 'WI-1115',
        internalNote: 'รออยู่หน้าร้านแล้ว',
      },
      {
        id: 'queue_t007',
        shopId,
        queueNumber: 'T007',
        queueDate,
        customerId: 'customer_mind',
        serviceId: serviceTattooConsultId,
        staffId: staffBossId,
        source: 'tattoo',
        status: 'pending_review',
        startsAt: at('13:00'),
        endsAt: at('13:30'),
        estimatedWaitMinutes: 45,
        queueAhead: 1,
        bookingCode: 'TR-1300',
        customerNote: 'fineline floral, ต้นแขน, งบประมาณ 2,500-3,500',
        tattooRequestId: 'tattoo_request_t007',
      },
      {
        id: 'queue_a023',
        shopId,
        queueNumber: 'A023',
        queueDate,
        customerId: 'customer_ball',
        serviceId: serviceBeardTrimId,
        staffId: staffArmId,
        source: 'online',
        status: 'checked_in',
        startsAt: at('14:30'),
        endsAt: at('15:15'),
        estimatedWaitMinutes: 45,
        queueAhead: 12,
        bookingCode: 'DC-1430',
        customerNote: 'มาก่อนเวลา นั่งรอในร้าน',
      },
      {
        id: 'queue_a024',
        shopId,
        queueNumber: 'A024',
        queueDate,
        customerId: 'customer_praew',
        serviceId: serviceModernFadeId,
        staffId: staffArmId,
        source: 'online',
        status: 'confirmed',
        startsAt: at('16:00'),
        endsAt: at('17:00'),
        estimatedWaitMinutes: 60,
        queueAhead: 13,
        bookingCode: 'DC-1600',
        customerNote: 'ต้องการทรงสุภาพสำหรับสัมภาษณ์งาน',
      },
    ],
  })

  await prisma.businessHours.createMany({
    data: [0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
      shopId,
      staffId: null,
      dayOfWeek,
      opensAt: '10:00',
      closesAt: '20:00',
      isClosed: dayOfWeek === 3,
    })),
  })

  await prisma.blockedTime.createMany({
    data: [
      {
        id: 'blocked_lunch',
        shopId,
        staffId: staffArmId,
        startsAt: at('12:15'),
        endsAt: at('13:00'),
        reason: 'พักกลางวัน / เคลียร์อุปกรณ์',
      },
      {
        id: 'blocked_tattoo_long',
        shopId,
        staffId: staffBossId,
        startsAt: at('17:00'),
        endsAt: at('18:30'),
        reason: 'งานสักยาวที่ต้อง confirm',
      },
    ],
  })

  await prisma.dailyQueueCounter.createMany({
    data: [
      { shopId, queueDate, prefix: 'A', lastNumber: 24 },
      { shopId, queueDate, prefix: 'T', lastNumber: 7 },
    ],
  })

  console.log('Seeded Dream Catcher sample data.')
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
