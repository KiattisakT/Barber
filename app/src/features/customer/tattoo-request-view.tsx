import { CheckCircle2, ClipboardList, PhoneCall, Sparkles, Syringe } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { NativeSelect } from '../../components/ui/native-select'
import { Textarea } from '../../components/ui/textarea'
import { cn } from '../../lib/utils'

type TattooRequestViewProps = {
  tattooCustomerName: string
  tattooCustomerPhone: string
  tattooPlacement: string
  tattooSize: string
  tattooBudget: string
  tattooPreferredDate: string
  tattooIdea: string
  tattooReferenceName: string
  tattooTouched: boolean
  tattooPhoneDigits: string
  tattooSubmitted: boolean
  tattooRequestCode: string
  canSubmitTattooRequest: boolean
  tattooValidationMessages: string[]
  onTattooCustomerNameChange: (value: string) => void
  onTattooCustomerPhoneChange: (value: string) => void
  onTattooPlacementChange: (value: string) => void
  onTattooSizeChange: (value: string) => void
  onTattooBudgetChange: (value: string) => void
  onTattooPreferredDateChange: (value: string) => void
  onTattooIdeaChange: (value: string) => void
  onTattooReferenceNameChange: (value: string) => void
  onSubmitTattooRequest: () => void
}

export const TattooRequestView = ({
  tattooCustomerName,
  tattooCustomerPhone,
  tattooPlacement,
  tattooSize,
  tattooBudget,
  tattooPreferredDate,
  tattooIdea,
  tattooReferenceName,
  tattooTouched,
  tattooPhoneDigits,
  tattooSubmitted,
  tattooRequestCode,
  canSubmitTattooRequest,
  tattooValidationMessages,
  onTattooCustomerNameChange,
  onTattooCustomerPhoneChange,
  onTattooPlacementChange,
  onTattooSizeChange,
  onTattooBudgetChange,
  onTattooPreferredDateChange,
  onTattooIdeaChange,
  onTattooReferenceNameChange,
  onSubmitTattooRequest,
}: TattooRequestViewProps) => {
  return (
    <div className="px-5 pb-8 pt-5">
      <section>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="warning">pending review</Badge>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-balance">ส่งรายละเอียดงานสักให้ร้านดูก่อน</h1>
            <p className="mt-1 max-w-[34ch] text-sm leading-6 text-muted">ยังไม่ใช่นัดหมายจริง ร้านจะ review แบบ เวลา และงบ แล้วติดต่อกลับ</p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[8px] bg-copper text-paper shadow-lg shadow-copper/20">
            <Syringe className="h-5 w-5" />
          </div>
        </div>
      </section>

      <Card className="mt-5 bg-paper p-4 shadow-lg shadow-ink/5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-ivory text-copper-dark">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold">ข้อมูลติดต่อ</h2>
            <p className="mt-1 text-sm leading-6 text-muted">ร้านต้องใช้ติดต่อกลับหลัง review</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="tattoo-name">ชื่อผู้ติดต่อ</Label>
            <Input
              id="tattoo-name"
              className="mt-1.5"
              value={tattooCustomerName}
              placeholder="เช่น คุณมายด์"
              aria-invalid={tattooTouched && tattooCustomerName.trim().length <= 1}
              onChange={(event) => onTattooCustomerNameChange(event.target.value)}
            />
            {tattooTouched && tattooCustomerName.trim().length <= 1 ? <p className="mt-1 text-xs text-cancelled">กรอกชื่ออย่างน้อย 2 ตัวอักษร</p> : null}
          </div>
          <div>
            <Label htmlFor="tattoo-phone">เบอร์โทรศัพท์ / LINE</Label>
            <Input
              id="tattoo-phone"
              className="mt-1.5 tabular-nums"
              inputMode="tel"
              value={tattooCustomerPhone}
              placeholder="08x-xxx-xxxx"
              aria-invalid={tattooTouched && tattooPhoneDigits.length < 9}
              onChange={(event) => onTattooCustomerPhoneChange(event.target.value)}
            />
            {tattooTouched && tattooPhoneDigits.length < 9 ? <p className="mt-1 text-xs text-cancelled">กรอกเบอร์โทรอย่างน้อย 9 หลัก</p> : null}
          </div>
        </div>
      </Card>

      <Card className="mt-5 bg-paper p-4 shadow-lg shadow-ink/5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-ivory text-copper-dark">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-semibold">รายละเอียดลาย</h2>
            <p className="mt-1 text-sm leading-6 text-muted">ยิ่งชัด ร้านยิ่งประเมินเวลาและราคาได้เร็ว</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="tattoo-placement">ตำแหน่งที่จะสัก</Label>
              <Input
                id="tattoo-placement"
                className="mt-1.5"
                value={tattooPlacement}
                placeholder="เช่น ต้นแขนด้านใน"
                aria-invalid={tattooTouched && tattooPlacement.trim().length < 2}
                onChange={(event) => onTattooPlacementChange(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tattoo-size">ขนาดโดยประมาณ</Label>
              <NativeSelect id="tattoo-size" className="mt-1.5" value={tattooSize} onChange={(event) => onTattooSizeChange(event.target.value)}>
                <option>เล็ก ประมาณ 5-8 ซม.</option>
                <option>กลาง ประมาณ 10-15 ซม.</option>
                <option>ใหญ่ มากกว่า 15 ซม.</option>
                <option>ยังไม่แน่ใจ ให้ร้านช่วยประเมิน</option>
              </NativeSelect>
            </div>
          </div>
          {tattooTouched && tattooPlacement.trim().length < 2 ? <p className="text-xs text-cancelled">ระบุตำแหน่งที่จะสัก</p> : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="tattoo-budget">งบประมาณ</Label>
              <Input id="tattoo-budget" className="mt-1.5" value={tattooBudget} placeholder="เช่น 2,500-3,500" onChange={(event) => onTattooBudgetChange(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="tattoo-date">วันที่สะดวก</Label>
              <Input id="tattoo-date" className="mt-1.5" value={tattooPreferredDate} placeholder="เช่น เสาร์หน้า / หลัง 18:00" onChange={(event) => onTattooPreferredDateChange(event.target.value)} />
            </div>
          </div>

          <div>
            <Label htmlFor="tattoo-idea">เล่าไอเดีย / style ที่อยากได้</Label>
            <Textarea
              id="tattoo-idea"
              className="mt-1.5 min-h-28 resize-none"
              value={tattooIdea}
              placeholder="เช่น fineline ดอกไม้เล็ก ๆ โทนเรียบ อยากให้ดูสุภาพ ไม่เข้มมาก"
              aria-invalid={tattooTouched && tattooIdea.trim().length < 10}
              onChange={(event) => onTattooIdeaChange(event.target.value)}
            />
            {tattooTouched && tattooIdea.trim().length < 10 ? <p className="mt-1 text-xs text-cancelled">เล่าไอเดียอย่างน้อย 10 ตัวอักษร</p> : null}
          </div>

          <div>
            <Label htmlFor="tattoo-reference">reference image mock</Label>
            <Input
              id="tattoo-reference"
              className="mt-1.5"
              value={tattooReferenceName}
              placeholder="ชื่อไฟล์หรือ link reference"
              onChange={(event) => onTattooReferenceNameChange(event.target.value)}
            />
            <p className="mt-1 text-xs text-muted">ตอนนี้เป็น mock input ก่อน ยังไม่ได้ upload ไฟล์จริง</p>
          </div>
        </div>
      </Card>

      <Card className="mt-5 rounded-[8px] border-line bg-paper p-3 shadow-2xl shadow-ink/10">
        <div className="flex items-center gap-3 px-2 py-2 text-sm">
          <div className="grid h-9 w-9 place-items-center rounded-[8px] bg-copper/10 text-copper-dark">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">Tattoo request</div>
            <div className="text-xs text-muted">pending_review · ร้านจะติดต่อกลับหลังประเมิน</div>
          </div>
          <Badge variant="warning">ไม่ใช่นัดจริง</Badge>
        </div>

        {tattooSubmitted ? (
          <div className="mt-3 rounded-[8px] border border-copper/20 bg-copper/10 p-4 text-sm text-copper-dark">
            <div className="flex items-center justify-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4" />
              ส่ง request แล้ว รหัส {tattooRequestCode}
            </div>
            <div className="mt-3 rounded-[8px] bg-paper/80 p-3 text-xs text-ink">
              <div className="font-semibold">{tattooPlacement || 'ตำแหน่งยังไม่ระบุ'} · {tattooSize}</div>
              <p className="mt-1 leading-5 text-muted">{tattooIdea}</p>
              {tattooBudget ? <div className="mt-2 text-muted">งบประมาณ: {tattooBudget}</div> : null}
            </div>
            <p className="mt-3 text-center text-xs leading-5 text-copper-dark">สถานะเริ่มต้นคือ pending_review ร้านจะติดต่อกลับเพื่อยืนยันรายละเอียดและเวลาจริง</p>
          </div>
        ) : (
          <>
            <Button
              className={cn('mt-2 h-14 w-full rounded-[8px] bg-copper text-base text-paper shadow-lg shadow-copper/25 hover:bg-copper-dark', !canSubmitTattooRequest && 'opacity-60')}
              aria-disabled={!canSubmitTattooRequest}
              onClick={onSubmitTattooRequest}
            >
              ส่งให้ร้าน review
            </Button>
            {!canSubmitTattooRequest ? <p className="mt-2 text-center text-xs text-muted">{tattooTouched ? tattooValidationMessages.join(' · ') : 'กรอกชื่อ เบอร์ ตำแหน่ง และไอเดียก่อนส่ง'}</p> : null}
          </>
        )}
      </Card>
    </div>
  )
}
