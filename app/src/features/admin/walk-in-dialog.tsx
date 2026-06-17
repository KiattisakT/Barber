import { CalendarPlus, X } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { NativeSelect } from '../../components/ui/native-select'
import { Textarea } from '../../components/ui/textarea'
import type { Service } from '../../lib/mock-data'

type WalkInDialogProps = {
  isOpen: boolean
  services: Service[]
  customerName: string
  serviceId: string
  note: string
  onCustomerNameChange: (value: string) => void
  onServiceIdChange: (value: string) => void
  onNoteChange: (value: string) => void
  onClose: () => void
  onAddWalkIn: () => void
}

export const WalkInDialog = ({ isOpen, services, customerName, serviceId, note, onCustomerNameChange, onServiceIdChange, onNoteChange, onClose, onAddWalkIn }: WalkInDialogProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/50 p-4 sm:place-items-center" role="dialog" aria-modal="true" aria-label="Add walk-in">
      <Card className="w-full max-w-md bg-paper text-ink shadow-2xl shadow-ink/30">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 p-5">
          <div>
            <CardTitle className="text-lg">เพิ่ม walk-in</CardTitle>
            <CardDescription className="mt-1">เพิ่มลูกค้าหน้าร้านเป็นสถานะมาถึงแล้วทันที</CardDescription>
          </div>
          <Button className="h-9 w-9 p-0 text-muted hover:text-ink" variant="ghost" onClick={onClose} type="button" aria-label="Close walk-in panel">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 p-5 pt-0">
          <div>
            <Label htmlFor="walk-in-customer">ชื่อลูกค้า</Label>
            <Input id="walk-in-customer" className="mt-1" value={customerName} onChange={(event) => onCustomerNameChange(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="walk-in-service">บริการ</Label>
            <NativeSelect id="walk-in-service" className="mt-1" value={serviceId} onChange={(event) => onServiceIdChange(event.target.value)}>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </NativeSelect>
          </div>
          <div>
            <Label htmlFor="walk-in-note">หมายเหตุ</Label>
            <Textarea id="walk-in-note" className="mt-1" value={note} onChange={(event) => onNoteChange(event.target.value)} />
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
            <Button onClick={onAddWalkIn}>
              <CalendarPlus className="h-4 w-4" />
              เพิ่มเข้าคิว
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
