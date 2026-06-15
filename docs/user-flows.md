# User Flows

## Flow 1: Customer Books Barber Appointment

1. ลูกค้าเปิด `/book/dream-catcher`
2. ระบบแสดงข้อมูลร้านและหมวดบริการ
3. ลูกค้าเลือก `ตัดผม`
4. ลูกค้าเลือกบริการ เช่น ตัดผมชาย
5. ระบบแสดงวันที่และเวลาที่ว่าง
6. ลูกค้าเลือก slot
7. ลูกค้ากรอกชื่อ เบอร์โทร และหมายเหตุ
8. ลูกค้ายืนยันการจอง
9. ระบบสร้าง appointment สถานะ `confirmed`
10. ระบบแสดง booking code และรายละเอียดคิว

## Flow 2: Customer Sends Tattoo Request

1. ลูกค้าเปิด `/book/dream-catcher`
2. ลูกค้าเลือก `สักลาย`
3. ระบบแสดงฟอร์ม tattoo request
4. ลูกค้ากรอกไอเดีย ตำแหน่ง ขนาด งบประมาณ และหมายเหตุ
5. ลูกค้าแนบรูป reference
6. ลูกค้ากรอกชื่อ เบอร์โทร และช่องทางติดต่อ
7. ลูกค้าส่งคำขอ
8. ระบบสร้าง tattoo request สถานะ `pending_review`
9. ระบบแจ้งว่าร้านจะติดต่อกลับเพื่อประเมินราคาและยืนยันนัด

## Flow 3: Shop Adds Walk-In Barber Queue

1. ร้านเปิด admin dashboard
2. ร้านกดเพิ่ม walk-in
3. ร้านเลือกหมวด `ตัดผม`
4. ร้านเลือกบริการ
5. ร้านใส่ชื่อลูกค้าหรือใช้ค่า default
6. ร้านเลือกช่าง
7. ระบบใส่เวลาเริ่มจากเวลาปัจจุบันหรือ slot ถัดไป
8. ระบบสร้าง appointment source `walk_in`
9. คิวใหม่แสดงใน daily queue

## Flow 4: Shop Manages Daily Queue

1. ร้านเปิดหน้า daily queue
2. ระบบแสดงคิว online, walk-in, และ tattoo request ที่เกี่ยวข้องกับวันนี้
3. ร้านดูคิวตามเวลาและสถานะ
4. เมื่อลูกค้ามาถึง ร้านเปลี่ยนสถานะเป็น `checked_in`
5. เมื่อเริ่มบริการ ร้านเปลี่ยนสถานะเป็น `in_progress`
6. เมื่อเสร็จ ร้านเปลี่ยนสถานะเป็น `completed`
7. ถ้าลูกค้าไม่มา ร้านเปลี่ยนสถานะเป็น `no_show`

## Flow 5: Shop Reviews Tattoo Request

1. ร้านเปิดหน้า tattoo requests
2. ระบบแสดงรายการ `pending_review`
3. ร้านเปิดรายละเอียดคำขอ
4. ร้านดู reference, ตำแหน่ง, ขนาด, budget และ note
5. ร้านติดต่อกลับลูกค้านอกระบบใน MVP แรก
6. ถ้าตกลงนัด ร้านสร้าง appointment จริงหรือเปลี่ยน request เป็น `confirmed`
7. ถ้ายังไม่พร้อม ร้านคงสถานะ pending หรือยกเลิกตาม policy

## Flow 6: Shop Blocks Time

1. ร้านเปิด business hours หรือ daily queue
2. ร้านเลือกช่วงเวลาที่ไม่รับคิว
3. ร้านใส่เหตุผล เช่น พัก, ธุระ, งานสักยาว
4. ระบบสร้าง blocked time
5. Slot ดังกล่าวหายจากหน้าจองลูกค้า

