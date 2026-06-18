import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Scissors, Sparkles, UserRound } from 'lucide-react'
import { Button } from '../components/ui/button'
import { AdvanceBookingView } from '../features/customer/advance-booking-view'
import { CustomerHome } from '../features/customer/customer-home'
import { MyQueueView } from '../features/customer/my-queue-view'
import { TattooRequestView } from '../features/customer/tattoo-request-view'
import { bookingBaseDate, getBookingDateKey, getBookingDates, rangesOverlap, timeToMinutes } from '../lib/booking-dates'
import { createCustomerAppointment, createCustomerQueueTicket, createCustomerTattooRequest } from '../lib/customer-booking-api'
import { barberServices, blockedTimes, timeSlots, type QueueItem } from '../lib/mock-data'
import {
  getActiveQueueItems,
  getNextQueueNumber,
  getPendingTattooItems,
  getQueueItemByNumber,
} from '../lib/queue-system'
import { cn } from '../lib/utils'

type CustomerBookingPageProps = {
  items: QueueItem[]
  onAddQueueItem: (item: QueueItem) => void
}

export const CustomerBookingPage = ({ items, onAddQueueItem }: CustomerBookingPageProps) => {
  const [customerView, setCustomerView] = useState<'home' | 'my_queue' | 'booking' | 'tattoo_request'>('home')
  const [selectedServiceId, setSelectedServiceId] = useState('classic-haircut')
  const [bookingWeekOffset, setBookingWeekOffset] = useState(0)
  const [selectedBookingDate, setSelectedBookingDate] = useState(getBookingDateKey(bookingBaseDate))
  const [selectedBookingSlot, setSelectedBookingSlot] = useState('14:30')
  const [bookingCustomerName, setBookingCustomerName] = useState('')
  const [bookingCustomerPhone, setBookingCustomerPhone] = useState('')
  const [bookingNote, setBookingNote] = useState('')
  const [bookingSubmitted, setBookingSubmitted] = useState(false)
  const [bookingTouched, setBookingTouched] = useState(false)
  const [bookingConfirmedCode, setBookingConfirmedCode] = useState('')
  const [tattooCustomerName, setTattooCustomerName] = useState('')
  const [tattooCustomerPhone, setTattooCustomerPhone] = useState('')
  const [tattooPlacement, setTattooPlacement] = useState('')
  const [tattooSize, setTattooSize] = useState('เล็ก ประมาณ 5-8 ซม.')
  const [tattooBudget, setTattooBudget] = useState('')
  const [tattooPreferredDate, setTattooPreferredDate] = useState('')
  const [tattooIdea, setTattooIdea] = useState('')
  const [tattooReferenceName, setTattooReferenceName] = useState('')
  const [tattooSubmitted, setTattooSubmitted] = useState(false)
  const [tattooTouched, setTattooTouched] = useState(false)
  const [tattooRequestCode, setTattooRequestCode] = useState('')
  const [lineConnected, setLineConnected] = useState(true)
  const [hasTicket, setHasTicket] = useState(false)
  const [customerTicket, setCustomerTicket] = useState<QueueItem | null>(null)

  const selectedService = barberServices.find((service) => service.id === selectedServiceId) ?? barberServices[0]
  const activeBarberQueue = getActiveQueueItems(items).filter((item) => item.source !== 'tattoo')
  const pendingTattooCount = getPendingTattooItems(items).length
  const fallbackCustomerQueue = getQueueItemByNumber(items, 'A023') ?? activeBarberQueue[0]
  const nextAvailableQueueNumber = getNextQueueNumber([...items, ...(customerTicket ? [customerTicket] : [])], 'A')
  const previewWaitMinutes = activeBarberQueue.reduce((total, item) => total + (Number.parseInt(item.duration, 10) || 45), 0)
  const customerQueue = customerTicket ?? (hasTicket ? fallbackCustomerQueue : null)
  const currentTicket = customerQueue?.queueNumber ?? nextAvailableQueueNumber
  const queueAhead = customerQueue?.queueAhead ?? activeBarberQueue.length
  const estimatedWait = customerQueue?.estimatedWaitMinutes ?? previewWaitMinutes

  const serviceTiles = [
    { id: 'classic-haircut', label: 'ตัดผมชาย', icon: UserRound },
    { id: 'modern-fade', label: 'ตัดผม + โกนหนวด', icon: Scissors },
    { id: 'beard-trim', label: 'โกนหนวด', icon: Sparkles },
  ]

  const progressSteps = [
    { label: 'รอเรียกคิว', helper: 'กรุณารอเรียกคิว', done: true },
    { label: 'กำลังดำเนินการ', helper: 'ร้านกำลังให้บริการคิวก่อนหน้า', done: false },
    { label: 'ใกล้เรียกคิวของคุณ', helper: 'เตรียมตัวเข้าร้านเมื่อแจ้งเตือน', done: false },
    { label: 'เสร็จสิ้น', helper: 'คิวจะย้ายไปประวัติ', done: false },
  ]

  const bookingDates = useMemo(() => getBookingDates(bookingWeekOffset), [bookingWeekOffset])
  const selectedDate = bookingDates.find((date) => date.value === selectedBookingDate) ?? bookingDates[0]
  const serviceDurationMinutes = Number.parseInt(selectedService.duration, 10) || 45
  const phoneDigits = bookingCustomerPhone.replace(/\D/g, '')
  const bookingSlots = useMemo(
    () =>
      timeSlots.map((slot, index) => {
        const slotStart = timeToMinutes(slot)
        const slotEnd = slotStart + serviceDurationMinutes
        const isPast = selectedDate.isToday && index < 3
        const blockedTime = blockedTimes.find((blockedTime) => {
          const [start, end] = blockedTime.time.split('-')
          return rangesOverlap(slotStart, slotEnd, timeToMinutes(start), timeToMinutes(end))
        })
        const bookedItem = selectedDate.isToday
          ? getActiveQueueItems(items).find((item) => {
              if (item.source === 'tattoo' || !item.time.includes(':') || !item.endTime.includes(':')) return false

              return rangesOverlap(slotStart, slotEnd, timeToMinutes(item.time), timeToMinutes(item.endTime))
            })
          : undefined
        const reason = isPast ? 'ผ่านแล้ว' : blockedTime ? blockedTime.reason : bookedItem ? `มีนัด ${bookedItem.time}` : null

        return { slot, available: !reason, reason }
      }),
    [selectedDate.isToday, serviceDurationMinutes],
  )
  const selectedSlot = bookingSlots.find((slot) => slot.slot === selectedBookingSlot) ?? bookingSlots[0]
  const availableSlotCount = bookingSlots.filter((slot) => slot.available).length
  const bookingValidationMessages = [
    bookingCustomerName.trim().length <= 1 ? 'กรอกชื่อผู้จอง' : null,
    phoneDigits.length < 9 ? 'กรอกเบอร์โทรให้ครบ' : null,
    !selectedSlot?.available ? 'เลือกเวลาที่ว่าง' : null,
  ].filter((message): message is string => Boolean(message))
  const canConfirmBooking = bookingValidationMessages.length === 0
  const bookingCode = `DC-${selectedBookingSlot.replace(':', '')}`
  const tattooPhoneDigits = tattooCustomerPhone.replace(/\D/g, '')
  const tattooValidationMessages = [
    tattooCustomerName.trim().length <= 1 ? 'กรอกชื่อผู้ส่ง request' : null,
    tattooPhoneDigits.length < 9 ? 'กรอกเบอร์โทรให้ครบ' : null,
    tattooPlacement.trim().length < 2 ? 'ระบุตำแหน่งที่จะสัก' : null,
    tattooIdea.trim().length < 10 ? 'เล่าไอเดียอย่างน้อย 10 ตัวอักษร' : null,
  ].filter((message): message is string => Boolean(message))
  const canSubmitTattooRequest = tattooValidationMessages.length === 0

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [customerView])

  useEffect(() => {
    if (selectedSlot?.available) return

    const firstAvailableSlot = bookingSlots.find((slot) => slot.available)

    if (firstAvailableSlot) {
      setSelectedBookingSlot(firstAvailableSlot.slot)
    }
  }, [bookingSlots, selectedSlot?.available])

  const takeTicket = async () => {
    if (hasTicket) {
      setCustomerView('my_queue')
      return
    }

    try {
      const nextCustomerTicket = await createCustomerQueueTicket({ service: selectedService })
      setCustomerTicket(nextCustomerTicket)
      onAddQueueItem(nextCustomerTicket)
      setHasTicket(true)
      setCustomerView('my_queue')
      return
    } catch {
      // Keep the prototype usable when backend is offline.
    }

    const queueAheadCount = activeBarberQueue.length
    const estimatedWaitMinutes = activeBarberQueue.reduce((total, item) => total + (Number.parseInt(item.duration, 10) || 45), 0)
    const queueNumber = getNextQueueNumber([...items, ...(customerTicket ? [customerTicket] : [])], 'A')
    const nextCustomerTicket: QueueItem = {
      id: `customer-ticket-${Date.now()}`,
      queueNumber,
      time: 'ตอนนี้',
      endTime: 'รอเรียก',
      customer: 'ลูกค้าหน้าร้าน',
      phone: '-',
      service: selectedService.name,
      staff: 'Arm',
      source: 'walk_in',
      status: 'checked_in',
      duration: selectedService.duration,
      estimatedWaitMinutes,
      queueAhead: queueAheadCount,
      bookingCode: `QT-${queueNumber}`,
      note: 'รับบัตรคิวจากหน้าลูกค้า',
    }

    setCustomerTicket(nextCustomerTicket)
    onAddQueueItem(nextCustomerTicket)
    setHasTicket(true)
    setCustomerView('my_queue')
  }

  const openBookingView = () => {
    if (selectedServiceId.startsWith('tattoo')) {
      setSelectedServiceId('classic-haircut')
    }

    setBookingSubmitted(false)
    setCustomerView('booking')
  }

  const openTattooRequestView = () => {
    setTattooSubmitted(false)
    setCustomerView('tattoo_request')
  }

  const changeBookingWeek = (direction: -1 | 1) => {
    const nextWeekOffset = Math.max(0, bookingWeekOffset + direction)
    const nextDates = getBookingDates(nextWeekOffset)

    setBookingWeekOffset(nextWeekOffset)
    setSelectedBookingDate(nextDates[0].value)
    setBookingSubmitted(false)
  }

  const goToCurrentBookingDate = () => {
    setBookingWeekOffset(0)
    setSelectedBookingDate(getBookingDateKey(bookingBaseDate))
    setBookingSubmitted(false)
  }

  const confirmBooking = async () => {
    setBookingTouched(true)

    if (!canConfirmBooking) return

    try {
      const response = await createCustomerAppointment({
        service: selectedService,
        dateValue: selectedBookingDate,
        slot: selectedBookingSlot,
        customerName: bookingCustomerName,
        phone: bookingCustomerPhone,
        customerNote: bookingNote,
      })
      setBookingConfirmedCode(response.queueItem.bookingCode)
    } catch {
      setBookingConfirmedCode(bookingCode)
    }

    setBookingSubmitted(true)
  }

  const submitTattooRequest = async () => {
    setTattooTouched(true)

    if (!canSubmitTattooRequest) return

    try {
      const result = await createCustomerTattooRequest({
        customerName: tattooCustomerName,
        phone: tattooCustomerPhone,
        placement: tattooPlacement,
        sizeEstimate: tattooSize,
        budgetEstimate: tattooBudget,
        preferredDateText: tattooPreferredDate,
        description: tattooIdea,
        referenceImageNames: tattooReferenceName.trim() ? [tattooReferenceName.trim()] : undefined,
      })
      onAddQueueItem(result.queueItem)
      setTattooRequestCode(result.queueItem.bookingCode)
      setTattooSubmitted(true)
      return
    } catch {
      // Keep the prototype usable when backend is offline.
    }

    const tattooQueueNumber = getNextQueueNumber(items, 'T')
    const nextTattooRequest: QueueItem = {
      id: `tattoo-request-${Date.now()}`,
      queueNumber: tattooQueueNumber,
      time: tattooPreferredDate.trim() || 'รอร้านติดต่อ',
      endTime: 'รอประเมิน',
      customer: tattooCustomerName.trim(),
      phone: tattooCustomerPhone.trim(),
      service: 'Tattoo request',
      staff: 'Boss',
      source: 'tattoo',
      status: 'pending_review',
      duration: 'รอประเมิน',
      estimatedWaitMinutes: 0,
      queueAhead: getPendingTattooItems(items).length,
      bookingCode: `TR-${tattooQueueNumber.slice(1)}`,
      note: [
        tattooIdea.trim(),
        tattooPlacement.trim() ? `ตำแหน่ง: ${tattooPlacement.trim()}` : null,
        tattooSize ? `ขนาด: ${tattooSize}` : null,
        tattooBudget.trim() ? `งบ: ${tattooBudget.trim()}` : null,
        tattooReferenceName.trim() ? `reference: ${tattooReferenceName.trim()}` : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }

    onAddQueueItem(nextTattooRequest)
    setTattooRequestCode(nextTattooRequest.bookingCode)
    setTattooSubmitted(true)
  }

  const customerViewTitle = customerView === 'booking' ? 'จองล่วงหน้า' : customerView === 'tattoo_request' ? 'ส่งไอเดียสักลาย' : 'คิวของฉัน'

  return (
    <main className="min-h-screen bg-ticket-bg text-ink">
      <section className="mx-auto max-w-[430px] bg-paper shadow-2xl shadow-ink/10 md:my-6 md:min-h-[860px] md:rounded-[8px] md:border md:border-line md:p-3">
        <div className="min-h-screen bg-paper md:min-h-[836px] md:overflow-hidden md:rounded-[8px]">
          <header className="sticky top-0 z-20 border-b border-line bg-paper/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <Button
                className={cn('h-10 w-10 p-0', customerView === 'home' && 'invisible')}
                variant="ghost"
                onClick={() => setCustomerView('home')}
                type="button"
                aria-label="Back to queue home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              {customerView === 'home' ? (
                <Link to="/book/dream-catcher" className="flex items-center gap-3">
                  <img className="h-12 w-12 object-contain" src="/brand/dream-catcher-logo-icon-v1.png" alt="Dream Catcher" />
                  <div>
                    <div className="font-semibold tracking-[0.12em] text-ink">DREAM CATCHER</div>
                    <div className="text-[11px] font-semibold tracking-[0.22em] text-ink">BARBER & TATTOO</div>
                  </div>
                </Link>
              ) : (
                <div className="text-base font-semibold">{customerViewTitle}</div>
              )}
              <div className="h-10 w-10" aria-hidden="true" />
            </div>
          </header>

          {customerView === 'home' ? (
            <CustomerHome
              lineConnected={lineConnected}
              hasTicket={hasTicket}
              currentTicket={currentTicket}
              estimatedWait={estimatedWait}
              queueAhead={queueAhead}
              activeBarberQueueCount={activeBarberQueue.length}
              pendingTattooCount={pendingTattooCount}
              serviceTiles={serviceTiles}
              selectedServiceId={selectedServiceId}
              onToggleLineConnected={() => setLineConnected((current) => !current)}
              onTakeTicket={takeTicket}
              onOpenBooking={openBookingView}
              onOpenMyQueue={() => setCustomerView('my_queue')}
              onSelectService={setSelectedServiceId}
              onOpenTattooRequest={openTattooRequestView}
            />
          ) : customerView === 'booking' ? (
            <AdvanceBookingView
              selectedService={selectedService}
              selectedServiceId={selectedServiceId}
              selectedDate={selectedDate}
              bookingDates={bookingDates}
              bookingWeekOffset={bookingWeekOffset}
              selectedBookingDate={selectedBookingDate}
              selectedBookingSlot={selectedBookingSlot}
              bookingSlots={bookingSlots}
              availableSlotCount={availableSlotCount}
              bookingCustomerName={bookingCustomerName}
              bookingCustomerPhone={bookingCustomerPhone}
              bookingNote={bookingNote}
              bookingTouched={bookingTouched}
              phoneDigits={phoneDigits}
              bookingSubmitted={bookingSubmitted}
              bookingCode={bookingConfirmedCode || bookingCode}
              canConfirmBooking={canConfirmBooking}
              bookingValidationMessages={bookingValidationMessages}
              onSelectService={(serviceId) => {
                setSelectedServiceId(serviceId)
                setBookingSubmitted(false)
              }}
              onGoToCurrentBookingDate={goToCurrentBookingDate}
              onChangeBookingWeek={changeBookingWeek}
              onSelectBookingDate={(dateValue) => {
                setSelectedBookingDate(dateValue)
                setBookingSubmitted(false)
              }}
              onSelectBookingSlot={(slot) => {
                setSelectedBookingSlot(slot)
                setBookingSubmitted(false)
              }}
              onBookingCustomerNameChange={(value) => {
                setBookingCustomerName(value)
                setBookingSubmitted(false)
              }}
              onBookingCustomerPhoneChange={(value) => {
                setBookingCustomerPhone(value)
                setBookingSubmitted(false)
              }}
              onBookingNoteChange={(value) => {
                setBookingNote(value)
                setBookingSubmitted(false)
              }}
              onConfirmBooking={confirmBooking}
            />
          ) : customerView === 'tattoo_request' ? (
            <TattooRequestView
              tattooCustomerName={tattooCustomerName}
              tattooCustomerPhone={tattooCustomerPhone}
              tattooPlacement={tattooPlacement}
              tattooSize={tattooSize}
              tattooBudget={tattooBudget}
              tattooPreferredDate={tattooPreferredDate}
              tattooIdea={tattooIdea}
              tattooReferenceName={tattooReferenceName}
              tattooTouched={tattooTouched}
              tattooPhoneDigits={tattooPhoneDigits}
              tattooSubmitted={tattooSubmitted}
              tattooRequestCode={tattooRequestCode}
              canSubmitTattooRequest={canSubmitTattooRequest}
              tattooValidationMessages={tattooValidationMessages}
              onTattooCustomerNameChange={(value) => {
                setTattooCustomerName(value)
                setTattooSubmitted(false)
              }}
              onTattooCustomerPhoneChange={(value) => {
                setTattooCustomerPhone(value)
                setTattooSubmitted(false)
              }}
              onTattooPlacementChange={(value) => {
                setTattooPlacement(value)
                setTattooSubmitted(false)
              }}
              onTattooSizeChange={(value) => {
                setTattooSize(value)
                setTattooSubmitted(false)
              }}
              onTattooBudgetChange={(value) => {
                setTattooBudget(value)
                setTattooSubmitted(false)
              }}
              onTattooPreferredDateChange={(value) => {
                setTattooPreferredDate(value)
                setTattooSubmitted(false)
              }}
              onTattooIdeaChange={(value) => {
                setTattooIdea(value)
                setTattooSubmitted(false)
              }}
              onTattooReferenceNameChange={(value) => {
                setTattooReferenceName(value)
                setTattooSubmitted(false)
              }}
              onSubmitTattooRequest={submitTattooRequest}
            />
          ) : (
            <MyQueueView
              currentTicket={currentTicket}
              estimatedWait={estimatedWait}
              queueAhead={queueAhead}
              progressSteps={progressSteps}
              lineConnected={lineConnected}
              onToggleLineConnected={() => setLineConnected((current) => !current)}
            />

          )}
        </div>
      </section>
    </main>
  )
}
