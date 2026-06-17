import type { LucideIcon } from 'lucide-react'
import { CalendarPlus, ChevronRight, Home, Syringe, Ticket, TicketCheck } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { cn } from '../../lib/utils'

type ServiceTile = {
  id: string
  label: string
  icon: LucideIcon
}

type CustomerHomeProps = {
  lineConnected: boolean
  hasTicket: boolean
  currentTicket: string
  estimatedWait: number
  queueAhead: number
  activeBarberQueueCount: number
  pendingTattooCount: number
  serviceTiles: ServiceTile[]
  selectedServiceId: string
  onToggleLineConnected: () => void
  onTakeTicket: () => void
  onOpenBooking: () => void
  onOpenMyQueue: () => void
  onSelectService: (serviceId: string) => void
  onOpenTattooRequest: () => void
}

export const CustomerHome = ({
  lineConnected,
  hasTicket,
  currentTicket,
  estimatedWait,
  queueAhead,
  activeBarberQueueCount,
  pendingTattooCount,
  serviceTiles,
  selectedServiceId,
  onToggleLineConnected,
  onTakeTicket,
  onOpenBooking,
  onOpenMyQueue,
  onSelectService,
  onOpenTattooRequest,
}: CustomerHomeProps) => {
  return (
    <div className="px-5 pb-24 pt-4">
      <Button
        className="h-auto w-full justify-between border-ink bg-paper px-4 py-3 text-left hover:bg-ivory"
        variant="secondary"
        onClick={onToggleLineConnected}
        type="button"
      >
        <span className="flex items-center gap-3">
          <Badge className="grid h-8 w-8 place-items-center bg-[#06c755] p-0 text-xs font-bold text-white">LINE</Badge>
          <span className="font-semibold">{lineConnected ? 'เชื่อมต่อ LINE แล้ว' : 'เชื่อมต่อ LINE เพื่อรับแจ้งเตือน'}</span>
        </span>
        <ChevronRight className="h-5 w-5" />
      </Button>

      <div className="mt-5">
        <h1 className="text-lg font-semibold">คิวปัจจุบัน</h1>
        <Card className="ticket-card mt-3 text-center">
          <CardContent className="p-4">
            <div className="overflow-hidden rounded-[8px] border border-dashed border-muted/50 px-4 py-5">
            <div className="text-sm font-semibold text-muted">{hasTicket ? 'หมายเลขคิวของคุณ' : 'คิวถัดไปถ้ารับตอนนี้'}</div>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="hidden text-2xl text-ink sm:inline">★</span>
              <div className="ticket-number text-5xl font-bold leading-none text-ticket-red sm:text-7xl">{currentTicket}</div>
              <span className="hidden text-2xl text-ink sm:inline">★</span>
            </div>
            <div className="mt-4 border-t border-dashed border-line pt-3 text-sm font-semibold">รอประมาณ {estimatedWait} นาที</div>
            <div className="mt-1 text-sm text-muted">รอคิวก่อนหน้า {queueAhead} คิว</div>
          </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-3">
        <Button className="h-14 w-full bg-ink text-paper hover:bg-charcoal" onClick={onTakeTicket}>
          <Ticket className="h-5 w-5" />
          <span>
            <span className="block text-base">{hasTicket ? 'ดูบัตรคิวของฉัน' : 'รับบัตรคิว'}</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-stone">{hasTicket ? 'VIEW MY TICKET' : 'TAKE A QUEUE TICKET'}</span>
          </span>
        </Button>
        <Button className="h-14 w-full border-ink" variant="secondary" onClick={onOpenBooking}>
          <CalendarPlus className="h-5 w-5" />
          <span>
            <span className="block text-base">จองล่วงหน้า</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-muted">BOOK A TIME</span>
          </span>
        </Button>
        <Button className="h-14 w-full border-ink" variant="secondary" disabled={!hasTicket} onClick={onOpenMyQueue}>
          <TicketCheck className="h-5 w-5" />
          <span>
            <span className="block text-base">{hasTicket ? 'เช็กคิวของฉัน' : 'ยังไม่มีคิวของฉัน'}</span>
            <span className="block text-[10px] font-semibold tracking-[0.16em] text-muted">MY QUEUE</span>
          </span>
        </Button>
      </div>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">เลือกบริการ</h2>
          <span className="text-xs text-muted">คิว active {activeBarberQueueCount} / สักรอ review {pendingTattooCount}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {serviceTiles.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="secondary"
              className={cn(
                'grid h-auto min-h-20 rounded-[8px] border-line bg-paper p-3 text-center text-xs font-medium shadow-sm shadow-ink/5 hover:bg-ivory',
                selectedServiceId === id && 'border-copper bg-copper/10 text-copper-dark shadow-copper/10',
              )}
              onClick={() => onSelectService(id)}
              type="button"
            >
              <Icon className="mx-auto h-7 w-7 stroke-[1.7]" />
              <span className="mt-2 block leading-5">{label}</span>
            </Button>
          ))}
        </div>
      </section>

      <Button
        className="mt-4 h-auto w-full items-start justify-start border-copper/20 bg-copper/5 p-4 text-left text-ink hover:border-copper/50 hover:bg-copper/10"
        variant="secondary"
        type="button"
        onClick={onOpenTattooRequest}
      >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-paper text-copper-dark">
            <Syringe className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">ส่งไอเดียสักลาย</h2>
              <Badge variant="warning">request/review</Badge>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted">งานสักจะเป็น request ให้ร้าน review ก่อน ไม่ใช่การรับคิวหรือจองเวลาทันที</p>
          </div>
          <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-copper-dark" />
      </Button>

      <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-line bg-paper/95 px-5 py-2 backdrop-blur md:absolute">
        <div className="grid grid-cols-3 text-[11px] font-medium text-muted">
          {[
            { label: 'หน้าหลัก', icon: Home, active: true, disabled: false, action: undefined },
            { label: 'คิวของฉัน', icon: Ticket, active: false, disabled: !hasTicket, action: onOpenMyQueue },
            { label: 'จองเวลา', icon: CalendarPlus, active: false, disabled: false, action: onOpenBooking },
          ].map(({ label, icon: Icon, active, disabled, action }) => (
            <Button key={label} className={cn('grid h-auto justify-items-center gap-1 py-1 text-[11px]', active && 'text-ink')} variant="ghost" disabled={disabled} onClick={action} type="button">
              <Icon className="h-5 w-5" />
              {label}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}
