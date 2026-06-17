# Queue-First UX Direction

เอกสารนี้กำหนด direction ใหม่สำหรับ Dream Catcher MVP หลังจากเปลี่ยนโฟกัสจาก booking prototype ไปเป็นเครื่องมือช่วยร้านจัดการคิวให้ชัดเจนขึ้น

## Product Direction

แกนของแอปควรเป็น `daily queue operating desk` สำหรับร้าน:

- ร้านต้องเห็นทันทีว่าตอนนี้กำลังทำคิวไหน
- ร้านต้องรู้ว่าคิวถัดไปคือใครและมาถึงหรือยัง
- walk-in ต้องถูกเพิ่มเข้าคิวได้เร็ว
- tattoo request ต้องแยกจาก confirmed appointment จนกว่าร้าน review
- blocked time ต้องเห็นในบริบทเดียวกับคิววันนี้

Customer booking ยังสำคัญ แต่หน้าลูกค้าเป็น input เข้าระบบคิว ส่วน admin daily queue คือพื้นที่ทำงานหลักของร้าน

## Single-Barber Operating Model

Direction ล่าสุด: ถ้าร้านมีช่างหลักเพียงคนเดียว app ต้องทำหน้าที่เป็นผู้ช่วยหน้าร้านของช่างคนนั้น

UX ต้องช่วยงานเหล่านี้ก่อน:

- ลดงานตอบแชท/รับโทรศัพท์ที่ซ้ำ ๆ
- บอกลูกค้าว่าร้านว่างเมื่อไหร่และต้องรอกี่คิว
- ป้องกันการรับนัดซ้อนจากหลายช่องทาง
- รวม online booking, walk-in, blocked time, และ tattoo request ไว้ในภาพคิวเดียว
- ช่วยจำข้อมูลลูกค้าและโน้ตบริการแทนช่าง
- ให้ช่างจัดการวันนี้ได้เร็วจากหน้าจอเดียว ไม่ต้องเข้า calendar ซับซ้อน

ดังนั้น MVP ไม่ควรดูเหมือนระบบ salon/backoffice ใหญ่เกินไป แต่ควรเป็น `small shop queue assistant` ที่เร็ว ชัด และใช้งานได้ระหว่างทำงานจริง

## Customer Direction

หน้าลูกค้าต้องช่วยให้คนจองเข้าใจคิวก่อนส่งข้อมูล:

- ใช้ visual metaphor แบบ `บัตรคิว` เป็น object หลัก ไม่ใช่ฟอร์ม booking เป็นหลัก
- แสดงหมายเลขคิวของลูกค้า เช่น `A023`, เวลารอประมาณ, และจำนวนคิวก่อนหน้าใน first viewport
- ให้ action หลักเป็น `รับบัตรคิว` และ action รองเป็น `เช็กคิวของฉัน`
- ถ้าลูกค้าต้องการนัดเวลา ไม่ใช่เข้าคิววันนี้ ต้องมี action แยก `จองล่วงหน้า`
- เชื่อม LINE/แจ้งเตือนควรอยู่ใกล้บัตรคิว เพราะเป็นส่วนหนึ่งของการรอคิว
- บริการแสดงเป็น icon grid ที่เลือกง่ายบนมือถือ
- หน้าคิวของฉันต้องมี ticket, status timeline, LINE notification toggle, และ cancel action
- งานสักยังต้องสื่อว่าเป็น request/review ก่อน ไม่ใช่นัดยืนยัน

Primary customer layout:

- Header: compact shop identity, menu
- Queue card: large ticket number, wait estimate, queue ahead
- Primary actions: take ticket, view my queue
- Advance booking: service, date, time, booking confirmation
- Service grid: haircut, haircut + shave, shave, tattoo sizes
- Bottom navigation: home, my queue, shop, shop info
- My queue view: ticket detail, progress timeline, LINE toggle, cancel queue

## UX Principles

1. Queue-first, calendar-later
   หน้า admin เริ่มจากคิววันนี้ ไม่ใช่ monthly calendar

2. Status is action
   สถานะต้องไม่ใช่ badge อ่านอย่างเดียว แต่ต้องบอก action ถัดไป เช่น `เช็กอิน`, `เริ่มบริการ`, `ปิดคิว`, `ยืนยันนัด`

3. One-screen operation
   เจ้าของร้านควรเข้าใจภาพรวมวันนี้ได้จากหนึ่งหน้าจอ: active queue, next customer, checked-in count, pending tattoo review, blocked time

4. Walk-in is normal
   UX ต้องมอง walk-in เป็น workflow หลัก ไม่ใช่ edge case

5. Tattoo request is not a booking
   request งานสักต้องสื่อชัดว่ายังรอ review และยังไม่ใช่นัดยืนยัน

6. Single barber first
   ทุก interaction ต้องถามก่อนว่า “ช่างคนเดียวใช้ระหว่างทำงานจริงได้ไหม” ถ้าเพิ่มความซับซ้อนโดยไม่ลดงานหน้าร้าน ให้เลื่อนออกจาก MVP

## Primary Admin Layout

- Left rail: identity, daily navigation, quick shop status
- Header: today intent and primary actions
- Metric strip: now serving, checked-in, pending review, active queue
- Workbench: now serving and next customer cards
- Queue board: list ordered by time with status action controls
- Detail panel: selected queue details, contact actions, note
- Side operations: tattoo review and blocked time

## Assumptions

- ยังใช้ mock data จนกว่า implementation จริงเริ่มเชื่อม backend
- เวลาทำการ 10:00-20:00 และวันหยุดยังต้องให้เจ้าของร้านยืนยัน
- การโทรหรือส่งข้อความใน mock UI ยังเป็น visual action ไม่ได้เชื่อมระบบจริง
- Walk-in mock ใช้ค่า default ก่อน เพื่อ validate flow ให้เร็ว

## Open Questions For Owner

- ร้านต้องการให้คิว walk-in แทรกตามเวลาที่มาถึง หรือเลือก slot เอง
- ถ้าลูกค้า late กี่นาทีถึงควรเปลี่ยนเป็น no-show
- ช่างแต่ละคนมี queue แยกกันตั้งแต่ MVP แรกหรือยัง
- Tattoo review ต้องมี checklist อะไรบ้างก่อนยืนยันนัด
