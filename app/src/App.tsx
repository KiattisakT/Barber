import { Link, Navigate, Route, Routes } from 'react-router'
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  ImagePlus,
  MapPin,
  Menu,
  Phone,
  Plus,
  Scissors,
  ShieldCheck,
} from 'lucide-react'
import { Button } from './components/ui/button'
import { barberServices, queueItems, timeSlots, type QueueStatus } from './lib/mock-data'
import { cn } from './lib/utils'

const statusText: Record<QueueStatus, string> = {
  confirmed: 'ยืนยันแล้ว',
  checked_in: 'มาถึงแล้ว',
  in_progress: 'กำลังให้บริการ',
  completed: 'เสร็จแล้ว',
  pending_review: 'รอ review',
}

const statusClass: Record<QueueStatus, string> = {
  confirmed: 'border-confirmed/30 bg-confirmed/10 text-confirmed',
  checked_in: 'border-waiting/30 bg-waiting/10 text-waiting',
  in_progress: 'border-in-progress/30 bg-in-progress/10 text-in-progress',
  completed: 'border-completed/30 bg-completed/10 text-completed',
  pending_review: 'border-copper/30 bg-copper/10 text-copper-dark',
}

function Header() {
  return (
    <header className="border-b border-line bg-paper/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/book/dream-catcher" className="flex items-center gap-3">
          <img className="h-10 w-10 rounded-[8px] object-contain" src="/brand/dream-catcher-logo-icon-v1.png" alt="Dream Catcher" />
          <div>
            <div className="text-sm font-semibold leading-5 text-ink">Dream Catcher</div>
            <div className="text-xs leading-4 text-muted">Barber & Tattoo</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 text-sm text-muted sm:flex">
          <Link className="rounded-[8px] px-3 py-2 hover:bg-stone/60 hover:text-ink" to="/book/dream-catcher">
            Booking
          </Link>
          <Link className="rounded-[8px] px-3 py-2 hover:bg-stone/60 hover:text-ink" to="/admin">
            Admin
          </Link>
        </nav>
        <Button className="sm:hidden" variant="secondary" size="sm" aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

function CustomerBookingPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <Header />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:py-10">
        <div className="space-y-6">
          <div className="rounded-[12px] border border-line bg-paper p-5 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-[8px] border border-confirmed/20 bg-confirmed/10 px-3 py-1.5 text-sm font-medium text-confirmed">
                  เปิดวันนี้ 10:00-20:00
                </div>
                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">จองคิว Dream Catcher</h1>
                <p className="mt-3 max-w-lg text-base leading-7 text-muted">
                  เลือกเวลาตัดผมได้เอง หรือส่งไอเดียสักลายให้ร้าน review ก่อนนัดจริง
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button size="lg">
                    <Scissors className="h-4 w-4" />
                    จองตัดผม
                  </Button>
                  <Button variant="secondary" size="lg">
                    <ImagePlus className="h-4 w-4" />
                    ส่งไอเดียสักลาย
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-[10px] border border-line bg-ivory p-3 sm:w-64">
                <img className="h-16 w-16 rounded-[8px] object-contain" src="/brand/dream-catcher-logo-mark-v1.png" alt="Dream Catcher logo" />
                <div className="text-sm leading-6 text-muted">
                  <div className="font-semibold text-ink">สันกำแพง, เชียงใหม่</div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> ร้านตัดผมและสักลาย</div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-[12px] border border-line bg-paper p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">เลือกบริการตัดผม</h2>
                <p className="mt-1 text-sm text-muted">ราคานี้เป็นข้อมูลตัวอย่าง รอเจ้าของร้านยืนยันอีกครั้ง</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {barberServices.map((service, index) => (
                <article
                  key={service.id}
                  className={cn(
                    'rounded-[10px] border bg-paper p-3 transition-colors',
                    index === 1 ? 'border-copper bg-copper/5' : 'border-line hover:border-copper/50',
                  )}
                >
                  <img className="h-32 w-full rounded-[8px] object-cover" src={service.image} alt={service.name} />
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-ink">{service.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted">{service.description}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-copper" />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink">{service.price}</span>
                    <span className="text-muted">{service.duration}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[12px] border border-line bg-paper p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-copper" />
                <h2 className="text-lg font-semibold text-ink">วันที่และเวลา</h2>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={slot}
                    className={cn(
                      'h-11 rounded-[8px] border text-sm font-medium transition-colors',
                      index === 3 ? 'border-copper bg-copper text-paper' : 'border-line bg-paper text-ink hover:border-copper',
                    )}
                    type="button"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-[12px] border border-line bg-paper p-5">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-copper" />
                <h2 className="text-lg font-semibold text-ink">ข้อมูลติดต่อ</h2>
              </div>
              <div className="mt-4 space-y-3">
                <label className="block text-sm font-medium text-ink">
                  ชื่อผู้จอง
                  <input className="mt-1 h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-copper/20" placeholder="เช่น คุณนนท์" />
                </label>
                <label className="block text-sm font-medium text-ink">
                  เบอร์โทร
                  <input className="mt-1 h-11 w-full rounded-[8px] border border-line bg-paper px-3 text-sm outline-none focus:border-copper focus:ring-2 focus:ring-copper/20" placeholder="08x-xxx-xxxx" />
                </label>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[12px] border border-line bg-paper p-5">
            <h2 className="text-lg font-semibold text-ink">สรุปคิวตัวอย่าง</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted">บริการ</span><span className="font-medium text-ink">Modern fade</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted">วันที่</span><span className="font-medium text-ink">วันนี้</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted">เวลา</span><span className="font-medium text-ink">13:00</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted">ราคา</span><span className="font-medium text-ink">฿350</span></div>
            </div>
            <Button className="mt-5 w-full">ยืนยันการจอง</Button>
            <p className="mt-3 text-xs leading-5 text-muted">MVP นี้ยังไม่เก็บมัดจำ ร้านจะใช้ booking code สำหรับอ้างอิงคิว</p>
          </div>

          <div className="rounded-[12px] border border-line bg-charcoal p-5 text-paper">
            <div className="flex items-start gap-3">
              <img className="h-16 w-16 rounded-[10px] bg-paper object-contain" src="/brand/dream-catcher-mascot-artist-v1.png" alt="Studio guide" />
              <div>
                <h2 className="text-base font-semibold">งานสักต้องให้ร้าน review ก่อน</h2>
                <p className="mt-2 text-sm leading-6 text-stone">ส่ง reference, ตำแหน่ง, ขนาด และงบประมาณ ร้านจะติดต่อกลับเพื่อประเมินก่อนยืนยันนัด</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

function AdminPage() {
  const pendingTattoo = queueItems.filter((item) => item.status === 'pending_review')

  return (
    <main className="min-h-screen bg-warm-black text-paper lg:grid lg:grid-cols-[236px_1fr]">
      <aside className="border-b border-paper/10 bg-charcoal px-4 py-4 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Link to="/book/dream-catcher" className="flex items-center gap-3">
          <img className="h-10 w-10 rounded-[8px] bg-paper object-contain" src="/brand/dream-catcher-logo-icon-v1.png" alt="Dream Catcher" />
          <div>
            <div className="text-sm font-semibold">Dream Catcher</div>
            <div className="text-xs text-stone">Admin</div>
          </div>
        </Link>
        <nav className="mt-6 flex gap-2 overflow-x-auto text-sm lg:block lg:space-y-1 lg:overflow-visible">
          {['คิววันนี้', 'Walk-in', 'Tattoo requests', 'Services'].map((item, index) => (
            <a key={item} className={cn('block rounded-[8px] px-3 py-2 whitespace-nowrap', index === 0 ? 'bg-paper text-ink' : 'text-stone hover:bg-paper/10 hover:text-paper')} href="#queue">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-4 border-b border-paper/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-[-0.02em]">คิววันนี้</h1>
              <p className="mt-2 text-sm text-stone">Online booking, walk-in และ tattoo request ที่ต้องดูวันนี้</p>
            </div>
            <Button variant="primary">
              <Plus className="h-4 w-4" />
              เพิ่ม walk-in
            </Button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
            <section id="queue" className="rounded-[12px] border border-paper/10 bg-paper text-ink">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div>
                  <h2 className="font-semibold">รายการคิว</h2>
                  <p className="mt-1 text-sm text-muted">เรียงตามเวลาเริ่มบริการ</p>
                </div>
                <Clock3 className="h-5 w-5 text-copper" />
              </div>
              <div className="divide-y divide-line">
                {queueItems.map((item) => (
                  <article key={item.id} className="grid gap-3 px-5 py-4 sm:grid-cols-[76px_1fr_auto] sm:items-center">
                    <div className="text-xl font-semibold tabular-nums text-ink">{item.time}</div>
                    <div>
                      <div className="font-semibold text-ink">{item.customer}</div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                        <span>{item.service}</span>
                        <span>ช่าง {item.staff}</span>
                        <span>{item.source}</span>
                      </div>
                    </div>
                    <span className={cn('w-fit rounded-[8px] border px-2.5 py-1 text-xs font-medium', statusClass[item.status])}>{statusText[item.status]}</span>
                  </article>
                ))}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-[12px] border border-paper/10 bg-paper p-5 text-ink">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-copper" />
                  <h2 className="font-semibold">สถานะวันนี้</h2>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[8px] border border-line p-3">
                    <dt className="text-muted">คิวทั้งหมด</dt>
                    <dd className="mt-1 text-xl font-semibold text-ink">{queueItems.length}</dd>
                  </div>
                  <div className="rounded-[8px] border border-line p-3">
                    <dt className="text-muted">รอ review</dt>
                    <dd className="mt-1 text-xl font-semibold text-ink">{pendingTattoo.length}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-[12px] border border-paper/10 bg-paper p-5 text-ink">
                <h2 className="font-semibold">Tattoo requests</h2>
                <div className="mt-4 space-y-3">
                  {pendingTattoo.map((item) => (
                    <div key={item.id} className="rounded-[8px] border border-line p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-ink">{item.customer}</div>
                          <div className="mt-1 text-sm text-muted">ดู reference และนัดประเมิน</div>
                        </div>
                        <Button size="sm" variant="secondary">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/book/dream-catcher" replace />} />
      <Route path="/book/dream-catcher" element={<CustomerBookingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/book/dream-catcher" replace />} />
    </Routes>
  )
}
