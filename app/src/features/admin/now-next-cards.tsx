import { CheckCircle2, Clock3, TimerReset } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import type { QueueItem, QueueStatus } from '../../lib/mock-data'

type NowNextCardsProps = {
  inProgress?: QueueItem
  nextCustomer?: QueueItem
  onUpdateStatus: (id: string, status: QueueStatus) => void
}

export const NowNextCards = ({ inProgress, nextCustomer, onUpdateStatus }: NowNextCardsProps) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-in-progress/30 bg-in-progress/10 text-paper">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-5">
          <div>
            <CardDescription className="text-stone">ตอนนี้</CardDescription>
            <CardTitle className="mt-1 text-4xl tracking-[-0.04em] text-paper">{inProgress ? inProgress.queueNumber : 'ว่าง'}</CardTitle>
            {inProgress ? <p className="mt-1 text-base font-medium text-stone">{inProgress.customer}</p> : null}
          </div>
          <Clock3 className="h-6 w-6 text-in-progress" />
        </CardHeader>
        {inProgress ? (
          <CardContent className="grid gap-3 p-5 pt-0 text-sm sm:grid-cols-2">
            <div>
              <div className="text-stone">เวลา</div>
              <div className="mt-1 font-semibold tabular-nums">{inProgress.time}-{inProgress.endTime}</div>
            </div>
            <div>
              <div className="text-stone">บริการ</div>
              <div className="mt-1 font-semibold">{inProgress.service}</div>
            </div>
            <Button className="h-12 text-base sm:col-span-2" onClick={() => onUpdateStatus(inProgress.id, 'completed')}>
              <CheckCircle2 className="h-4 w-4" />
              ปิดคิวนี้
            </Button>
          </CardContent>
        ) : (
          <CardContent className="p-5 pt-0">
            <p className="text-sm leading-6 text-stone">เลือกคิวที่มาถึงแล้วเพื่อเริ่มบริการ หรือเพิ่ม walk-in ถ้ามีลูกค้าหน้าร้าน</p>
          </CardContent>
        )}
      </Card>

      <Card className="border-waiting/30 bg-waiting/10 text-paper">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-5">
          <div>
            <CardDescription className="text-stone">คิวถัดไป</CardDescription>
            <CardTitle className="mt-1 text-4xl tracking-[-0.04em] text-paper">{nextCustomer ? nextCustomer.queueNumber : 'ไม่มี'}</CardTitle>
            {nextCustomer ? <p className="mt-1 text-base font-medium text-stone">{nextCustomer.customer}</p> : null}
          </div>
          <TimerReset className="h-6 w-6 text-waiting" />
        </CardHeader>
        {nextCustomer ? (
          <CardContent className="grid gap-3 p-5 pt-0 text-sm sm:grid-cols-2">
            <div>
              <div className="text-stone">สถานะ</div>
              <div className="mt-1 font-semibold">{nextCustomer.status === 'checked_in' ? 'มาถึงแล้ว' : 'ยังไม่เช็กอิน'}</div>
            </div>
            <div>
              <div className="text-stone">รอประมาณ</div>
              <div className="mt-1 font-semibold">{nextCustomer.estimatedWaitMinutes} นาที</div>
            </div>
            <Button
              className="h-12 text-base sm:col-span-2"
              disabled={nextCustomer.status === 'checked_in' && Boolean(inProgress)}
              onClick={() => onUpdateStatus(nextCustomer.id, nextCustomer.status === 'checked_in' ? 'in_progress' : 'checked_in')}
            >
              {nextCustomer.status === 'checked_in' && inProgress ? 'ปิดคิวปัจจุบันก่อน' : nextCustomer.status === 'checked_in' ? 'เริ่มคิวนี้' : 'เช็กอินคิวนี้'}
            </Button>
          </CardContent>
        ) : (
          <CardContent className="p-5 pt-0">
            <p className="text-sm leading-6 text-stone">ตอนนี้ไม่มีคิวที่รอเรียก</p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
