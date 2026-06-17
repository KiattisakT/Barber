import { CheckCircle2, Plus, TimerReset } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import type { QueueItem, QueueStatus } from '../../lib/mock-data'

type FocusActionCardProps = {
  inProgress?: QueueItem
  nextCustomer?: QueueItem
  onUpdateStatus: (id: string, status: QueueStatus) => void
  onOpenWalkIn: () => void
}

export const FocusActionCard = ({ inProgress, nextCustomer, onUpdateStatus, onOpenWalkIn }: FocusActionCardProps) => {
  const focusTitle = inProgress ? `กำลังทำ ${inProgress.queueNumber}` : nextCustomer ? `พร้อมเรียก ${nextCustomer.queueNumber}` : 'ยังไม่มีคิวเร่งด่วน'
  const focusHelper = inProgress
    ? `${inProgress.customer} · ${inProgress.service} · ${inProgress.time}-${inProgress.endTime}`
    : nextCustomer
      ? `${nextCustomer.customer} · ${nextCustomer.service} · ${nextCustomer.status === 'checked_in' ? 'มาถึงแล้ว' : 'ยังไม่เช็กอิน'}`
      : 'ถ้ามีลูกค้า walk-in ให้เพิ่มเข้าคิวก่อน แล้วค่อยเริ่มบริการ'

  return (
    <Card className="mt-5 border-copper/30 bg-[#211813] text-paper shadow-2xl shadow-warm-black/20">
      <CardContent className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-5">
        <div className="min-w-0">
          <div className="text-xs font-medium text-stone">งานต่อไป</div>
          <div className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-paper md:text-4xl">{focusTitle}</div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone">{focusHelper}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 md:min-w-[440px]">
          {inProgress ? (
            <Button className="h-14 text-base" onClick={() => onUpdateStatus(inProgress.id, 'completed')}>
              <CheckCircle2 className="h-5 w-5" />
              ปิดคิวนี้
            </Button>
          ) : null}
          {nextCustomer ? (
            <Button
              className="h-14 text-base"
              variant={inProgress ? 'secondary' : 'primary'}
              disabled={nextCustomer.status === 'checked_in' && Boolean(inProgress)}
              onClick={() => onUpdateStatus(nextCustomer.id, nextCustomer.status === 'checked_in' ? 'in_progress' : 'checked_in')}
            >
              <TimerReset className="h-5 w-5" />
              {nextCustomer.status === 'checked_in' && inProgress ? 'รอปิดคิว' : nextCustomer.status === 'checked_in' ? 'เริ่มคิวถัดไป' : 'เช็กอิน'}
            </Button>
          ) : null}
          <Button className="h-14 text-base" variant="secondary" onClick={onOpenWalkIn}>
            <Plus className="h-5 w-5" />
            walk-in
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
