# Product Data Model

เอกสารนี้เป็น data model ระดับ product เพื่อกำหนดข้อมูลที่ระบบต้องรองรับ ยังไม่ใช่ schema สำหรับ database จริง

## Shop

ร้านที่ใช้ระบบ booking

Fields:

- `id`
- `slug`
- `name`
- `displayName`
- `phone`
- `address`
- `mapUrl`
- `timezone`
- `status`

Notes:

- MVP มีร้านเดียวคือ Dream Catcher
- ต้องมี `shopId` ใน entity หลักตั้งแต่แรกเพื่อรองรับ SaaS ภายหลัง

## Staff

ช่างหรือคนที่รับบริการ

Fields:

- `id`
- `shopId`
- `name`
- `role`
- `phone`
- `isBookable`
- `status`

Notes:

- เริ่มต้นมี 1 คน
- ต้องรองรับเพิ่มอีก 1 คนโดยไม่เปลี่ยน flow หลัก

## Service

บริการที่ลูกค้าเลือก

Fields:

- `id`
- `shopId`
- `category`
- `name`
- `description`
- `price`
- `durationMinutes`
- `bufferMinutes`
- `isActive`

Category values:

- `barber`
- `tattoo`

Notes:

- Barber service ใช้สำหรับ instant booking
- Tattoo service อาจใช้เป็น consultation/request ใน MVP

## Customer

ข้อมูลลูกค้า

Fields:

- `id`
- `shopId`
- `name`
- `phone`
- `lineId`
- `notes`

Notes:

- MVP ใช้ชื่อและเบอร์โทรเป็นข้อมูลขั้นต่ำ
- `lineId` เตรียมไว้สำหรับ LINE integration ภายหลัง

## Appointment

คิวบริการที่มีวันเวลา

Fields:

- `id`
- `shopId`
- `staffId`
- `customerId`
- `serviceId`
- `source`
- `status`
- `startsAt`
- `endsAt`
- `bookingCode`
- `customerNote`
- `internalNote`

Source values:

- `online`
- `walk_in`
- `admin`

Status values:

- `confirmed`
- `checked_in`
- `in_progress`
- `completed`
- `cancelled`
- `no_show`

Notes:

- Tattoo request ที่ยังไม่ยืนยันไม่จำเป็นต้องเป็น appointment ทันที
- ระบบต้องป้องกัน appointment ซ้อนใน staff คนเดียวกัน

## Tattoo Request

คำขอสักลายที่รอร้านประเมิน

Fields:

- `id`
- `shopId`
- `customerId`
- `preferredStaffId`
- `status`
- `placement`
- `sizeEstimate`
- `budgetEstimate`
- `description`
- `referenceImageIds`
- `preferredDate`
- `internalNote`

Status values:

- `pending_review`
- `contacted`
- `confirmed`
- `cancelled`

Notes:

- เริ่มจาก `pending_review`
- เมื่อร้านยืนยันนัด อาจสร้าง appointment ที่เชื่อมกับ tattoo request

## Reference Image

รูป reference สำหรับ tattoo request

Fields:

- `id`
- `shopId`
- `tattooRequestId`
- `url`
- `fileName`
- `mimeType`
- `sizeBytes`

## Business Hours

เวลาทำการประจำของร้านหรือ staff

Fields:

- `id`
- `shopId`
- `staffId`
- `dayOfWeek`
- `opensAt`
- `closesAt`
- `isClosed`

Notes:

- ถ้ายังไม่มี staff-specific hours ให้ใช้ shop-level hours
- ข้อมูลเริ่มต้นที่ต้องยืนยัน: เปิด 10:00-20:00 และหยุดวันพุธ

## Blocked Time

ช่วงเวลาที่ไม่รับคิว

Fields:

- `id`
- `shopId`
- `staffId`
- `startsAt`
- `endsAt`
- `reason`

Notes:

- ใช้สำหรับพัก ธุระ วันหยุดพิเศษ หรืองานสักยาว

## Future SaaS Entities

ยังไม่ต้องทำใน MVP แต่ควรออกแบบไม่ให้ขัดกับ entity เหล่านี้:

- `shop_users`
- `roles`
- `subscriptions`
- `plans`
- `shop_settings`
- `notification_templates`
- `payments`

