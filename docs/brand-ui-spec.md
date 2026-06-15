# Brand UI Spec

เอกสารนี้แปลง identity direction ของ Dream Catcher Barber and Tattoo ให้เป็นแนวทาง UI สำหรับเฟสแรก

## Brand Direction

ใช้แนวทาง `Hybrid`:

- Customer booking: สะอาด อ่านง่าย ใช้งานเร็ว บนมือถือ
- Admin dashboard: เข้มขึ้นเล็กน้อย สแกนคิวได้ไว ไม่ตกแต่งเกินจำเป็น
- Visual character: barber/tattoo studio, craft, calm, professional, local Chiang Mai

## Assets

Primary mark:

- `docs/assets/brand/direct-v1/dream-catcher-logo-mark-v1.png`
- ใช้ในพื้นที่ขนาดกลางถึงใหญ่ เช่น brand section, cover, printed preview
- ไม่เหมาะสำหรับ favicon เพราะรายละเอียดเยอะ

Simplified UI icon:

- `docs/assets/brand/direct-v1/dream-catcher-logo-icon-v1.png`
- ใช้กับ header, favicon base, loading mark, compact navigation, mobile UI
- ควรเป็น default mark สำหรับ UI prototype

Mascot:

- `docs/assets/brand/direct-v1/dream-catcher-mascot-artist-v1.png`
- ใช้กับ confirmation, empty state, tattoo request handoff, onboarding
- หลีกเลี่ยงการใช้ในทุก card เพราะจะทำให้ UI หนัก

## Color Tokens

Core:

- `ink`: `#111111`
- `charcoal`: `#1C1A18`
- `warm-black`: `#0E0D0B`
- `ivory`: `#F8F3EA`
- `paper`: `#FFFDF8`
- `stone`: `#E8E0D4`
- `muted-gray`: `#7D746A`
- `copper`: `#C77745`
- `copper-dark`: `#8E4C2D`

Status:

- `confirmed`: `#2F6F4E`
- `waiting`: `#9B6A2F`
- `in-progress`: `#1F5D7A`
- `completed`: `#4D6252`
- `cancelled`: `#8A3E35`
- `no-show`: `#5B5650`

Usage:

- Customer UI ใช้ `paper`/`ivory` เป็นพื้นหลัก
- Admin UI ใช้ `warm-black` หรือ `charcoal` เป็น shell ได้ แต่ content surface ควรยังอ่านง่าย
- `copper` ใช้เป็น accent เท่านั้น เช่น active state, focus ring, primary CTA
- หลีกเลี่ยง gradient หนักและพื้นดำทั้งหน้าที่ทำให้ form อ่านยาก

## Typography Direction

ยังไม่ล็อก font จริงในเฟส docs แต่ mood ควรเป็น:

- Display/headline: compact, confident, editorial, ไม่ decorative เกิน
- Body/UI: readable Thai-first, mobile-friendly, spacing สบาย
- Numeric/time: tabular or highly scannable for queue slots

Font candidate ตอน implement:

- Thai/UI: `Noto Sans Thai`, `LINE Seed Sans TH`, หรือ `IBM Plex Sans Thai`
- Latin/display: ใช้ font เดียวกับ Thai ได้เพื่อลด complexity

Rules:

- Customer form label ต้องอ่านง่ายกว่า mood
- Admin time/status ต้อง scan ได้ใน 1-2 วินาที
- หลีกเลี่ยงตัวอักษรแคบหรือ tattoo-style script สำหรับ UI text

## Customer Booking UI

Tone:

- Clean local shop
- Warm, direct, low-friction
- Brand details อยู่ใน header/hero และ small accents ไม่ครอบ form

First screen should show:

- Logo icon
- Shop name
- Open/closed hint
- Main action: `จองตัดผม`
- Secondary action: `ส่งไอเดียสักลาย`

Primary components:

- Service selector
- Date selector
- Time slot grid
- Contact form
- Booking confirmation card
- Tattoo request form with image upload area

Component style:

- Cards: max 8px radius
- Buttons: stable height, clear active/disabled states
- Time slots: large enough for thumb tap
- Form fields: clear labels, no placeholder-only UX
- Status badges: compact, color + text

## Admin UI

Tone:

- Work-focused
- Queue-first
- Dense but calm

Default landing screen:

- Daily queue, not monthly calendar
- Today summary
- Next appointment
- Walk-in button
- Tattoo request review count

Primary components:

- Queue list
- Status segmented control
- Add walk-in sheet/modal
- Block time action
- Service settings table
- Business hours controls

Component style:

- More compact than customer UI
- Use color status carefully, not full rainbow
- Queue item should prioritize time, customer name, service, status, staff
- Mascot should not appear in the main working queue except empty state

## Logo And Icon Usage

Use simplified icon when:

- Header is compact
- Favicon/app icon is needed
- Slot/loading/empty small mark is needed
- Mobile nav needs identity

Use detailed logo mark when:

- Brand direction page
- Large hero or cover
- Printed/signage exploration
- Owner review presentation

Do not:

- Put detailed logo mark inside tiny buttons
- Use logo as decorative watermark behind form fields
- Stretch or crop logo assets
- Put black logo on dark surface without a light/inverted variant

## Mascot Usage

Use mascot for:

- Successful booking confirmation
- Tattoo request received
- Empty queue
- Friendly onboarding
- Error state only when tone is calm and practical

Do not use mascot for:

- Every screen header
- Tiny icon
- Dense admin queue
- Serious error that needs direct explanation

## UI Prototype Priorities

1. Customer booking start page
2. Barber service selection
3. Date/time slot selection
4. Booking confirmation
5. Tattoo request form
6. Admin daily queue
7. Add walk-in flow
8. Tattoo request review

## Open Decisions

- Final production font
- Whether dark mode is required for customer UI
- Whether favicon should be transparent or dark rounded-square app icon
- Whether mascot should have alternate poses later
- Whether final logo should be redrawn as SVG/vector after UI direction is validated

