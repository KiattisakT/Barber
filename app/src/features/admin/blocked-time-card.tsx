import { Plus, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import type { BlockedTime } from '../../lib/mock-data'

type BlockedTimeCardProps = {
  dailyBlocks: BlockedTime[]
  onAddBlock: () => void
}

export const BlockedTimeCard = ({ dailyBlocks, onAddBlock }: BlockedTimeCardProps) => {
  return (
    <Card className="border-paper/10 bg-paper text-ink">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 p-5">
        <div>
          <CardTitle>เวลาที่บล็อก</CardTitle>
          <CardDescription className="mt-1">กันจองทับตอนพักหรือเคลียร์อุปกรณ์</CardDescription>
        </div>
        <Button size="sm" variant="secondary" onClick={onAddBlock}>
          <Plus className="h-3.5 w-3.5" />
          เพิ่ม
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0">
        {dailyBlocks.map((block) => (
          <Card key={block.id} className="border-0 bg-ivory">
            <CardContent className="flex items-start gap-3 p-3 text-sm">
              <X className="mt-0.5 h-4 w-4 text-cancelled" />
              <div>
                <div className="font-semibold tabular-nums text-ink">{block.time}</div>
                <div className="mt-1 text-muted">{block.reason}</div>
                <div className="mt-1 text-xs text-muted">ช่าง {block.staff}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
