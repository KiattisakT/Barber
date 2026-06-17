import { CalendarPlus, CheckCircle2, ChevronLeft, ChevronRight, Clock3, PhoneCall } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { barberServices, type Service } from '../../lib/mock-data'
import { cn } from '../../lib/utils'

type BookingDateOption = {
  value: string
  weekday: string
  date: string
  fullLabel: string
  isToday: boolean
}

type BookingSlotOption = {
  slot: string
  available: boolean
  reason: string | null
}

type AdvanceBookingViewProps = {
  selectedService: Service
  selectedServiceId: string
  selectedDate: BookingDateOption
  bookingDates: BookingDateOption[]
  bookingWeekOffset: number
  selectedBookingDate: string
  selectedBookingSlot: string
  bookingSlots: BookingSlotOption[]
  availableSlotCount: number
  bookingCustomerName: string
  bookingCustomerPhone: string
  bookingNote: string
  bookingTouched: boolean
  phoneDigits: string
  bookingSubmitted: boolean
  bookingCode: string
  canConfirmBooking: boolean
  bookingValidationMessages: string[]
  onSelectService: (serviceId: string) => void
  onGoToCurrentBookingDate: () => void
  onChangeBookingWeek: (direction: -1 | 1) => void
  onSelectBookingDate: (dateValue: string) => void
  onSelectBookingSlot: (slot: string) => void
  onBookingCustomerNameChange: (value: string) => void
  onBookingCustomerPhoneChange: (value: string) => void
  onBookingNoteChange: (value: string) => void
  onConfirmBooking: () => void
}

export const AdvanceBookingView = ({
  selectedService,
  selectedServiceId,
  selectedDate,
  bookingDates,
  bookingWeekOffset,
  selectedBookingDate,
  selectedBookingSlot,
  bookingSlots,
  availableSlotCount,
  bookingCustomerName,
  bookingCustomerPhone,
  bookingNote,
  bookingTouched,
  phoneDigits,
  bookingSubmitted,
  bookingCode,
  canConfirmBooking,
  bookingValidationMessages,
  onSelectService,
  onGoToCurrentBookingDate,
  onChangeBookingWeek,
  onSelectBookingDate,
  onSelectBookingSlot,
  onBookingCustomerNameChange,
  onBookingCustomerPhoneChange,
  onBookingNoteChange,
  onConfirmBooking,
}: AdvanceBookingViewProps) => {
  return (
    <div className="px-5 pb-8 pt-5">
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="warning">จองล่วงหน้า</Badge>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-balance">เลือกวันและเวลาที่สะดวก</h1>
            <p className="mt-1 max-w-[30ch] text-sm leading-6 text-muted">กันเวลาช่างไว้ก่อนเข้าร้าน และรับแจ้งเตือนผ่าน LINE</p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-ink text-paper shadow-lg shadow-ink/10">
            <CalendarPlus className="h-5 w-5" />
          </div>
        </div>
      </section>

      <Card className="mt-4 rounded-[8px] bg-ivory p-3">
        <div className="flex items-center justify-between gap-3 px-1">
          <div>
            <div className="text-xs text-muted">บริการ</div>
            <div className="mt-1 font-semibold">{selectedService.name}</div>
          </div>
          <Badge variant="secondary">{selectedService.duration}</Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 pb-1">
          {barberServices.map((service) => (
            <Button
              key={service.id}
              variant="secondary"
              size="sm"
              className={cn(
                'h-10 min-w-fit rounded-[8px] border px-3 text-xs',
                selectedServiceId === service.id
                  ? 'border-copper bg-copper text-paper shadow-md shadow-copper/20 hover:bg-copper-dark'
                  : 'border-transparent bg-paper hover:border-copper/40 hover:bg-copper/10 hover:text-copper-dark hover:shadow-sm hover:shadow-copper/10',
              )}
              onClick={() => onSelectService(service.id)}
              type="button"
            >
              {service.name}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="mt-5 bg-paper p-3 shadow-lg shadow-ink/5">
        <div className="flex items-start justify-between gap-3 px-1">
          <div>
            <div className="text-xs font-medium text-muted">วันและเวลา</div>
            <h2 className="mt-1 text-lg font-semibold">{selectedDate.fullLabel}</h2>
          </div>
          <div className="flex items-center gap-1 text-muted">
            <Button className="h-8 rounded-[8px] px-2 text-xs hover:bg-copper/10 hover:text-copper-dark" variant="ghost" onClick={onGoToCurrentBookingDate} type="button">
              วันนี้
            </Button>
            <Button
              className="h-8 w-8 rounded-[8px] p-0 hover:bg-copper/10 hover:text-copper-dark"
              variant="ghost"
              aria-label="Previous week"
              disabled={bookingWeekOffset === 0}
              onClick={() => onChangeBookingWeek(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8 rounded-[8px] p-0 hover:bg-copper/10 hover:text-copper-dark"
              variant="ghost"
              aria-label="Next week"
              onClick={() => onChangeBookingWeek(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 min-[390px]:grid-cols-7">
          {bookingDates.map((date) => (
            <Button
              key={date.value}
              variant="secondary"
              className={cn(
                'h-[68px] w-full flex-col gap-1 rounded-[8px] border px-1 shadow-sm shadow-ink/5',
                selectedBookingDate === date.value
                  ? 'border-ink bg-ink text-paper shadow-lg shadow-ink/15 hover:bg-ink'
                  : 'border-transparent bg-ivory hover:border-copper/40 hover:bg-copper/10 hover:text-copper-dark hover:shadow-copper/10',
              )}
              onClick={() => onSelectBookingDate(date.value)}
              type="button"
            >
              <span className={cn('text-[11px] font-medium', selectedBookingDate === date.value ? 'text-paper/70' : 'text-muted')}>{date.weekday}</span>
              <span className="text-lg font-semibold tabular-nums">{date.date}</span>
            </Button>
          ))}
        </div>

        <div className="mt-4 border-t border-line pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-copper" />
              <span className="font-semibold">เลือกเวลา</span>
            </div>
            <span className="text-xs text-muted">คิวว่าง {availableSlotCount} ช่วง</span>
          </div>
          <div className="grid grid-cols-3 gap-2 min-[390px]:grid-cols-4">
            {bookingSlots.map(({ slot, available, reason }) => {
              const unavailable = !available

              return (
                <Button
                  key={slot}
                  title={reason ?? undefined}
                  variant="secondary"
                  className={cn(
                    'h-12 w-full flex-col gap-0.5 rounded-[8px] border px-1 text-sm font-semibold tabular-nums shadow-sm shadow-ink/5',
                    selectedBookingSlot === slot && !unavailable
                      ? 'border-copper bg-copper text-paper shadow-lg shadow-copper/25 hover:bg-copper-dark'
                      : 'border-transparent bg-ivory hover:border-copper/40 hover:bg-copper/10 hover:text-copper-dark hover:shadow-copper/10',
                    unavailable && 'cursor-not-allowed bg-stone/60 text-muted line-through shadow-none hover:bg-stone/60',
                  )}
                  disabled={unavailable}
                  onClick={() => onSelectBookingSlot(slot)}
                  type="button"
                >
                  <span>{slot}</span>
                  {reason ? <span className="mt-0.5 text-[10px] font-medium leading-none no-underline">{reason === 'ผ่านแล้ว' ? 'ผ่านแล้ว' : 'ไม่ว่าง'}</span> : null}
                </Button>
              )
            })}
          </div>
        </div>
      </Card>

      <Card className="mt-5 bg-paper p-4 shadow-lg shadow-ink/5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-ivory text-copper-dark">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold">ข้อมูลผู้จอง</h2>
            <p className="mt-1 text-sm leading-6 text-muted">ใช้สำหรับยืนยันนัดและแจ้งเตือนก่อนถึงเวลา</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="booking-name">ชื่อผู้จอง</Label>
            <Input
              id="booking-name"
              className="mt-1.5"
              value={bookingCustomerName}
              placeholder="เช่น คุณต้น"
              aria-invalid={bookingTouched && bookingCustomerName.trim().length <= 1}
              onChange={(event) => onBookingCustomerNameChange(event.target.value)}
            />
            {bookingTouched && bookingCustomerName.trim().length <= 1 ? <p className="mt-1 text-xs text-cancelled">กรอกชื่อผู้จองอย่างน้อย 2 ตัวอักษร</p> : null}
          </div>
          <div>
            <Label htmlFor="booking-phone">เบอร์โทรศัพท์ / LINE</Label>
            <Input
              id="booking-phone"
              className="mt-1.5 tabular-nums"
              inputMode="tel"
              value={bookingCustomerPhone}
              placeholder="08x-xxx-xxxx"
              aria-invalid={bookingTouched && phoneDigits.length < 9}
              onChange={(event) => onBookingCustomerPhoneChange(event.target.value)}
            />
            {bookingTouched && phoneDigits.length < 9 ? <p className="mt-1 text-xs text-cancelled">กรอกเบอร์โทรอย่างน้อย 9 หลัก</p> : null}
          </div>
          <div>
            <Label htmlFor="booking-note">โน้ตถึงร้าน</Label>
            <Textarea
              id="booking-note"
              className="mt-1.5 min-h-20 resize-none"
              value={bookingNote}
              placeholder="เช่น ขอช่างที่ถนัด fade / มาช้าประมาณ 5 นาที"
              onChange={(event) => onBookingNoteChange(event.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="mt-5 rounded-[8px] border-line bg-paper p-3 shadow-2xl shadow-ink/10">
        <div className="flex items-center gap-3 px-2 py-2 text-sm">
          <div className="grid h-9 w-9 place-items-center rounded-[8px] bg-ivory text-ink">
            <Clock3 className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">{selectedDate.fullLabel}</div>
            <div className="text-xs text-muted">
              <span className="tabular-nums">{selectedBookingSlot}</span> · {selectedService.duration} · {selectedService.name}
            </div>
          </div>
          <Badge variant="warning">{selectedService.price}</Badge>
        </div>
        {bookingSubmitted ? (
          <div className="mt-3 rounded-[8px] border border-confirmed/20 bg-confirmed/10 p-4 text-sm text-confirmed">
            <div className="flex items-center justify-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              จองแล้ว รหัสนัดหมาย {bookingCode}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-[8px] bg-paper/70 p-3 text-xs text-ink">
              <div>
                <div className="text-muted">ผู้จอง</div>
                <div className="mt-1 font-semibold">{bookingCustomerName}</div>
              </div>
              <div>
                <div className="text-muted">ติดต่อ</div>
                <div className="mt-1 font-semibold tabular-nums">{bookingCustomerPhone}</div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-confirmed">ร้านจะกันเวลานี้ไว้ และแจ้งเตือนผ่าน LINE ก่อนถึงคิว</p>
          </div>
        ) : (
          <>
            <Button
              className={cn('mt-2 h-14 w-full rounded-[8px] bg-copper text-base text-paper shadow-lg shadow-copper/25 hover:bg-copper-dark', !canConfirmBooking && 'opacity-60')}
              aria-disabled={!canConfirmBooking}
              onClick={onConfirmBooking}
            >
              ยืนยันการจอง
            </Button>
            {!canConfirmBooking ? <p className="mt-2 text-center text-xs text-muted">{bookingTouched ? bookingValidationMessages.join(' · ') : 'กรอกชื่อและเบอร์โทรก่อนยืนยันการจอง'}</p> : null}
          </>
        )}
      </Card>
    </div>
  )
}
