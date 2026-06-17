import { Link } from 'react-router'
import { CalendarPlus, ClipboardList, ListChecks, MessageSquareText } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent } from '../../components/ui/card'
import type { QueueView } from '../../lib/queue-system'
import { cn } from '../../lib/utils'

type AdminSidebarProps = {
  queueView: QueueView
  activeItemsCount: number
  dailyBlocksCount: number
  onQueueViewChange: (view: QueueView) => void
  onOpenWalkIn: () => void
}

export const AdminSidebar = ({ queueView, activeItemsCount, dailyBlocksCount, onQueueViewChange, onOpenWalkIn }: AdminSidebarProps) => {
  const navItems = [
    { label: 'คิววันนี้', icon: ClipboardList, active: queueView === 'active', action: () => onQueueViewChange('active') },
    { label: 'งานที่ต้องทำ', icon: ListChecks, active: queueView === 'needs_action', action: () => onQueueViewChange('needs_action') },
    { label: 'เพิ่ม walk-in', icon: CalendarPlus, active: false, action: onOpenWalkIn },
    { label: 'รีวิวงานสัก', icon: MessageSquareText, active: queueView === 'needs_action', action: () => onQueueViewChange('needs_action') },
  ]

  return (
    <aside className="border-b border-paper/10 bg-charcoal px-4 py-4 lg:min-h-screen lg:border-b-0 lg:border-r">
      <Link to="/book/dream-catcher" className="flex items-center gap-3">
        <img className="h-10 w-10 rounded-[8px] bg-paper object-contain" src="/brand/dream-catcher-logo-icon-v1.png" alt="Dream Catcher" />
        <div>
          <div className="text-sm font-semibold">Dream Catcher</div>
          <div className="text-xs text-stone">Queue desk</div>
        </div>
      </Link>
      <nav className="mt-6 flex gap-2 overflow-x-auto text-sm lg:block lg:space-y-1 lg:overflow-visible">
        {navItems.map(({ label, icon: Icon, active, action }) => (
          <Button
            key={label}
            variant="ghost"
            className={cn('h-10 w-full justify-start whitespace-nowrap px-3', active ? 'bg-paper text-ink' : 'text-stone hover:bg-paper/10 hover:text-paper')}
            onClick={action}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </nav>
      <Card className="mt-6 border-paper/10 bg-paper/5 text-stone">
        <CardContent className="p-3 text-xs leading-5">
          <div className="font-medium text-paper">วันนี้ 10:00-20:00</div>
          <div>ช่างหลัก 1 คน · block time {dailyBlocksCount} ช่วง · active {activeItemsCount} คิว</div>
        </CardContent>
      </Card>
    </aside>
  )
}
