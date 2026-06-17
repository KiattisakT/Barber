import { Ban, Filter } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import type { QueueItem, QueueStatus } from '../../lib/mock-data'
import { nextStatus, nextStatusText, sourceText, statusClass, statusText, statusToneClass } from '../../lib/queue-display'
import type { QueueView } from '../../lib/queue-system'
import { cn } from '../../lib/utils'

type AdminQueueBoardProps = {
  visibleItems: QueueItem[]
  selectedItem?: QueueItem
  inProgress?: QueueItem
  queueView: QueueView
  onQueueViewChange: (view: QueueView) => void
  onSelectQueue: (id: string) => void
  onUpdateStatus: (id: string, status: QueueStatus) => void
}

export const AdminQueueBoard = ({ visibleItems, selectedItem, inProgress, queueView, onQueueViewChange, onSelectQueue, onUpdateStatus }: AdminQueueBoardProps) => {
  return (
    <Card className="border-paper/10 bg-paper text-ink">
      <CardHeader className="flex-col gap-3 space-y-0 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>คิววันนี้</CardTitle>
          <CardDescription className="mt-1">แตะรายการเพื่อดูรายละเอียด ปุ่มขวาคือสิ่งที่ทำต่อได้ทันที</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ['active', 'คิว active'],
            ['needs_action', 'ต้องทำตอนนี้'],
            ['all', 'ทั้งหมด'],
          ].map(([view, label]) => (
            <Button
              key={view}
              size="sm"
              variant={queueView === view ? 'primary' : 'secondary'}
              onClick={() => onQueueViewChange(view as QueueView)}
            >
              <Filter className="h-3.5 w-3.5" />
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <div className="divide-y divide-line">
        {visibleItems.map((item) => {
          const next = nextStatus[item.status]
          const nextActionDisabled = next === 'in_progress' && Boolean(inProgress) && item.id !== inProgress?.id

          return (
            <article
              key={item.id}
              className={cn(
                'grid gap-4 border-l-4 px-4 py-5 transition-colors hover:bg-ivory/70 lg:grid-cols-[104px_minmax(0,1fr)_auto] lg:items-center',
                statusToneClass[item.status],
                selectedItem?.id === item.id && 'bg-ivory',
              )}
              onClick={() => onSelectQueue(item.id)}
            >
              <div>
                <div className="ticket-number text-4xl font-bold text-ticket-red">{item.queueNumber}</div>
                <div className="mt-1 text-xs tabular-nums text-muted">{item.time}-{item.endTime}</div>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-ink">{item.customer}</h3>
                  <Badge className={statusClass[item.status]}>{statusText[item.status]}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                  <span>{item.service}</span>
                  <span>ช่าง {item.staff}</span>
                  <span>{sourceText[item.source]}</span>
                  <span>{item.duration}</span>
                </div>
                <p className="mt-2 line-clamp-1 text-sm text-muted">{item.note}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {next ? (
                  <Button
                    disabled={nextActionDisabled}
                    className="h-10 px-4"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation()
                      onUpdateStatus(item.id, next)
                    }}
                  >
                    {nextActionDisabled ? 'รอปิดคิว' : nextStatusText[item.status]}
                  </Button>
                ) : null}
                {item.status !== 'completed' && item.status !== 'no_show' ? (
                  <Button
                    className="h-10 px-4"
                    size="sm"
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation()
                      onUpdateStatus(item.id, 'no_show')
                    }}
                  >
                    <Ban className="h-3.5 w-3.5" />
                    no-show
                  </Button>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </Card>
  )
}
