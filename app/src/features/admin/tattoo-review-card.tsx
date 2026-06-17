import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import type { QueueItem, QueueStatus } from '../../lib/mock-data'

type TattooReviewCardProps = {
  pendingTattoo: QueueItem[]
  onUpdateStatus: (id: string, status: QueueStatus) => void
}

export const TattooReviewCard = ({ pendingTattoo, onUpdateStatus }: TattooReviewCardProps) => {
  return (
    <Card className="border-paper/10 bg-paper text-ink">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0 p-5">
        <div>
          <CardTitle>รีวิวงานสัก</CardTitle>
          <CardDescription className="mt-1">ยังไม่ใช่นัดจริง รอติดต่อกลับ</CardDescription>
        </div>
        <Badge variant="warning">{pendingTattoo.length}</Badge>
      </CardHeader>
      <CardContent className="space-y-3 p-5 pt-0">
        {pendingTattoo.length > 0 ? (
          pendingTattoo.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3">
                <div className="font-medium text-ink">{item.customer}</div>
                <p className="mt-1 text-sm leading-6 text-muted">{item.note}</p>
                <Button className="mt-3 w-full" size="sm" variant="secondary" onClick={() => onUpdateStatus(item.id, 'confirmed')}>
                  ยืนยันเป็นนัดหมาย
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-4 text-sm text-muted">ไม่มี request ที่รอ review</CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
