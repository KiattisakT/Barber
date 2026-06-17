import { CircleDashed, Clock3, Plus, Search } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'

type AdminHeaderProps = {
  onAddBlock: () => void
  onOpenWalkIn: () => void
}

export const AdminHeader = ({ onAddBlock, onOpenWalkIn }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 border-b border-paper/10 pb-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <Badge className="mb-3 border-copper/30 bg-copper/10 text-copper">
          <CircleDashed className="h-3.5 w-3.5" />
          โหมดช่างคนเดียว
        </Badge>
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-balance">มองแป๊บเดียว รู้ว่าต้องทำอะไรต่อ</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone">ปุ่มใหญ่ ข้อความสั้น ใช้ตอนมือไม่ว่างได้เร็ว — คิวตอนนี้ คิวถัดไป walk-in และเวลาที่ต้อง block</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" className="h-12 bg-paper/10 px-5 text-paper hover:bg-paper/15">
          <Search className="h-4 w-4" />
          ค้นหาคิว
        </Button>
        <Button variant="secondary" className="h-12 bg-paper/10 px-5 text-paper hover:bg-paper/15" onClick={onAddBlock}>
          <Clock3 className="h-4 w-4" />
          block เวลา
        </Button>
        <Button className="h-12 px-5 text-base" variant="primary" onClick={onOpenWalkIn}>
          <Plus className="h-4 w-4" />
          เพิ่ม walk-in
        </Button>
      </div>
    </div>
  )
}
