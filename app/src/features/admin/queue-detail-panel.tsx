import { MessageSquareText, PhoneCall, TimerReset, X } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import type { QueueItem, QueueStatus } from '../../lib/mock-data'
import { nextStatus, nextStatusText, statusClass, statusText } from '../../lib/queue-display'

type QueueDetailPanelProps = {
  selectedItem?: QueueItem
  inProgress?: QueueItem
  onUpdateStatus: (id: string, status: QueueStatus) => void
}

export const QueueDetailPanel = ({ selectedItem, inProgress, onUpdateStatus }: QueueDetailPanelProps) => {
  return (
    <Card className="border-paper/10 bg-paper text-ink">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-5">
        <div>
          <CardTitle>รายละเอียด</CardTitle>
          <CardDescription className="mt-1">โทร ดูโน้ต หรือเลื่อนสถานะจากตรงนี้</CardDescription>
        </div>
        <Badge className={selectedItem ? statusClass[selectedItem.status] : undefined}>{selectedItem ? statusText[selectedItem.status] : 'ไม่มีคิว'}</Badge>
      </CardHeader>
      {selectedItem ? (
        <CardContent className="space-y-4 p-5 pt-0 text-sm">
          <div>
            <div className="text-xs text-muted">ลูกค้า</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="ticket-number text-2xl font-bold text-ticket-red">{selectedItem.queueNumber}</span>
              <span className="text-xl font-semibold text-ink">{selectedItem.customer}</span>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3">
            <Card className="border-0 bg-ivory">
              <CardContent className="p-3">
                <dt className="text-muted">รหัส</dt>
                <dd className="mt-1 font-semibold">{selectedItem.bookingCode}</dd>
              </CardContent>
            </Card>
            <Card className="border-0 bg-ivory">
              <CardContent className="p-3">
                <dt className="text-muted">โทร</dt>
                <dd className="mt-1 font-semibold tabular-nums">{selectedItem.phone}</dd>
              </CardContent>
            </Card>
            <Card className="border-0 bg-ivory">
              <CardContent className="p-3">
                <dt className="text-muted">เวลา</dt>
                <dd className="mt-1 font-semibold tabular-nums">{selectedItem.time}-{selectedItem.endTime}</dd>
              </CardContent>
            </Card>
            <Card className="border-0 bg-ivory">
              <CardContent className="p-3">
                <dt className="text-muted">ช่าง</dt>
                <dd className="mt-1 font-semibold">{selectedItem.staff}</dd>
              </CardContent>
            </Card>
          </dl>
          <Card>
            <CardContent className="p-3">
              <div className="text-xs text-muted">หมายเหตุ</div>
              <p className="mt-1 leading-6">{selectedItem.note}</p>
            </CardContent>
          </Card>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button className="h-12" variant="secondary">
              <PhoneCall className="h-4 w-4" />
              โทรหาลูกค้า
            </Button>
            <Button className="h-12" variant="secondary">
              <MessageSquareText className="h-4 w-4" />
              ส่งข้อความ
            </Button>
          </div>
          <Separator />
          <div className="grid gap-2 sm:grid-cols-2">
            {nextStatus[selectedItem.status] ? (
              <Button
                className="h-12"
                disabled={nextStatus[selectedItem.status] === 'in_progress' && Boolean(inProgress) && selectedItem.id !== inProgress?.id}
                onClick={() => onUpdateStatus(selectedItem.id, nextStatus[selectedItem.status]!)}
              >
                <TimerReset className="h-4 w-4" />
                {nextStatus[selectedItem.status] === 'in_progress' && inProgress && selectedItem.id !== inProgress.id ? 'ปิดคิวปัจจุบันก่อน' : nextStatusText[selectedItem.status]}
              </Button>
            ) : null}
            <Button variant="secondary" className="h-12 border-cancelled text-cancelled hover:bg-cancelled/10" onClick={() => onUpdateStatus(selectedItem.id, 'cancelled')}>
              <X className="h-4 w-4" />
              ยกเลิกคิว
            </Button>
          </div>
        </CardContent>
      ) : null}
    </Card>
  )
}
