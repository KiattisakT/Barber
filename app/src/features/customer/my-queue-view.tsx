import { BellRing, CheckCircle2, ChevronRight, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import { Switch } from '../../components/ui/switch'
import { cn } from '../../lib/utils'

type ProgressStep = {
  label: string
  helper: string
  done: boolean
}

type MyQueueViewProps = {
  currentTicket: string
  estimatedWait: number
  queueAhead: number
  progressSteps: ProgressStep[]
  lineConnected: boolean
  onToggleLineConnected: () => void
}

export const MyQueueView = ({ currentTicket, estimatedWait, queueAhead, progressSteps, lineConnected, onToggleLineConnected }: MyQueueViewProps) => {
  return (
    <div className="px-5 pb-24 pt-5">
      <Card className="ticket-card text-center">
        <CardContent className="p-5">
          <div className="text-sm font-semibold tracking-[0.18em] text-ink">DREAM CATCHER</div>
          <div className="text-[11px] font-semibold tracking-[0.2em] text-muted">BARBER & TATTOO</div>
          <div className="mt-4 border-t border-line pt-3 text-sm text-muted">หมายเลขคิว</div>
          <div className="ticket-number mt-1 text-5xl font-bold leading-none text-ticket-red sm:text-7xl">{currentTicket}</div>
          <div className="stamp stamp-wait mx-auto mt-3 w-fit text-base">รอเรียกคิว</div>
          <div className="mt-5 grid grid-cols-2 divide-x divide-line border-t border-dashed border-line pt-4 text-sm">
            <div>
              <div className="text-muted">รอประมาณ</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums">{estimatedWait}</div>
              <div className="text-xs text-muted">นาที</div>
            </div>
            <div>
              <div className="text-muted">คิวก่อนหน้า</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums">{queueAhead}</div>
              <div className="text-xs text-muted">คิว</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="mt-5 space-y-4">
        {progressSteps.map((step, index) => (
          <div key={step.label} className="grid grid-cols-[28px_1fr_auto] gap-3">
            <div className="relative grid justify-items-center">
              <div className={cn('grid h-7 w-7 place-items-center rounded-full border', step.done ? 'border-confirmed bg-confirmed text-paper' : 'border-line bg-paper text-muted')}>
                {step.done ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 rotate-90" />}
              </div>
              {index < progressSteps.length - 1 ? <div className="absolute top-7 h-7 border-l border-line" /> : null}
            </div>
            <div>
              <div className="font-semibold">{step.label}</div>
              <div className="mt-1 text-sm text-muted">{step.helper}</div>
            </div>
            {index === 0 ? <div className="text-sm tabular-nums text-muted">09:41</div> : null}
          </div>
        ))}
      </section>

      <Card className="mt-6 flex items-center justify-between gap-3 p-4">
        <span className="flex min-w-0 items-center gap-3">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-[#06c755] text-white">
            <BellRing className="h-5 w-5" />
            <span className="absolute -bottom-1 rounded-[8px] bg-paper px-1.5 py-0.5 text-[9px] font-bold text-[#06c755] shadow-sm">LINE</span>
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold">แจ้งเตือนผ่าน LINE</span>
            <span className={cn('mt-0.5 block text-sm leading-5', lineConnected ? 'text-confirmed' : 'text-muted')}>
              {lineConnected ? 'เปิดอยู่ จะเตือนก่อนถึงคิว' : 'ปิดอยู่ แตะเพื่อเปิดแจ้งเตือน'}
            </span>
          </span>
        </span>
        <Switch
          checked={lineConnected}
          onClick={onToggleLineConnected}
          aria-label={lineConnected ? 'ปิดแจ้งเตือนผ่าน LINE' : 'เปิดแจ้งเตือนผ่าน LINE'}
        />
      </Card>

      <Button className="mt-4 h-12 w-full border-cancelled text-cancelled hover:bg-cancelled/10" variant="secondary">
        <X className="h-4 w-4" />
        ยกเลิกคิวนี้
      </Button>
    </div>
  )
}
