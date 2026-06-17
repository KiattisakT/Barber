import { MessageSquareText, ShieldCheck, TimerReset, UserCheck } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import type { QueueItem } from '../../lib/mock-data'

type AdminSummaryProps = {
  inProgress?: QueueItem
  checkedInCount: number
  pendingTattooCount: number
  activeItemsCount: number
  totalItemsCount: number
}

export const AdminSummary = ({ inProgress, checkedInCount, pendingTattooCount, activeItemsCount, totalItemsCount }: AdminSummaryProps) => {
  const summaryCards = [
    {
      label: 'กำลังทำ',
      value: inProgress ? inProgress.queueNumber : 'ว่าง',
      helper: inProgress ? `${inProgress.customer} · ${inProgress.time}-${inProgress.endTime}` : 'พร้อมรับคิวใหม่',
      icon: TimerReset,
    },
    { label: 'รอในร้าน', value: checkedInCount, helper: 'แตะเพื่อเริ่มคิวถัดไป', icon: UserCheck },
    { label: 'สักรอรีวิว', value: pendingTattooCount, helper: 'ดูตอนมีจังหวะว่าง', icon: MessageSquareText },
    { label: 'คิวที่ยังไม่จบ', value: activeItemsCount, helper: `ทั้งหมดวันนี้ ${totalItemsCount}`, icon: ShieldCheck },
  ]

  return (
    <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map(({ label, value, helper, icon: Icon }) => (
        <Card key={label} className="border-paper/10 bg-paper/8 text-paper shadow-sm shadow-warm-black/10">
          <CardContent className="p-4 md:p-5">
            <dt className="flex items-center gap-2 text-xs font-medium text-stone">
              <Icon className="h-4 w-4 text-copper" />
              {label}
            </dt>
            <dd className="mt-3 text-3xl font-semibold tracking-[-0.03em] tabular-nums text-paper">{String(value)}</dd>
            <div className="mt-1 min-h-8 text-xs leading-4 text-stone">{helper}</div>
          </CardContent>
        </Card>
      ))}
    </dl>
  )
}
