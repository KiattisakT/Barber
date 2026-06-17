# Backend API Contract V0

เอกสารนี้เป็น contract แรกสำหรับ backend ของ Dream Catcher MVP ก่อนเริ่ม Express + Prisma + PostgreSQL จริง จุดประสงค์คือให้ frontend และ backend ใช้ domain shape เดียวกัน ไม่ใช่ OpenAPI spec สุดท้าย

## Scope

V0 ครอบคลุมเฉพาะร้าน Dream Catcher ร้านเดียว แต่ทุก entity หลักต้องมี `shopId` เพื่อไม่ปิดทาง future SaaS

Included:

- public shop/customer queue data
- customer take queue ticket
- customer advance barber booking
- customer tattoo request
- admin daily queue read
- admin status transition
- admin add walk-in
- admin blocked time

Not included in V0:

- auth/login
- payment/deposit
- real LINE OA integration
- file upload storage for tattoo references
- multi-shop admin switching
- role/permission system
- POS/loyalty/packages

## API Conventions

Base path:

```text
/api
```

Content type:

```text
Content-Type: application/json
```

Date/time format:

- API uses ISO 8601 strings for persisted date/time fields.
- UI can still display Thai/local labels.
- Shop timezone is `Asia/Bangkok`.

Error response shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ชื่อหรือเบอร์โทรไม่ครบ",
    "details": {
      "phone": "Phone is required"
    }
  }
}
```

Common error codes:

- `VALIDATION_ERROR`
- `SHOP_NOT_FOUND`
- `SERVICE_NOT_FOUND`
- `QUEUE_ITEM_NOT_FOUND`
- `BLOCKED_TIME_CONFLICT`
- `APPOINTMENT_CONFLICT`
- `INVALID_STATUS_TRANSITION`
- `IN_PROGRESS_EXISTS`

## IDs and Queue Numbers

IDs are backend-generated strings.

Queue numbers are daily per shop and prefix:

- `A001`, `A002`, ... for barber queue / walk-in / confirmed appointments
- `T001`, `T002`, ... for tattoo requests

Rules:

- queue number is stable after creation
- sequence resets daily per `shopId` and prefix
- sequence generation must be backend-owned
- customer and admin always see the same queue number

## Entity DTOs

### ShopPublicDto

```ts
type ShopPublicDto = {
  id: string
  slug: string
  displayName: string
  phone: string | null
  address: string | null
  mapUrl: string | null
  timezone: 'Asia/Bangkok'
  status: 'active' | 'inactive'
  todayHours: {
    opensAt: string
    closesAt: string
    isClosed: boolean
  }
}
```

### StaffDto

```ts
type StaffDto = {
  id: string
  shopId: string
  name: string
  role: 'barber' | 'tattoo_artist' | 'owner'
  isBookable: boolean
  status: 'active' | 'inactive'
}
```

### ServiceDto

```ts
type ServiceDto = {
  id: string
  shopId: string
  category: 'barber' | 'tattoo'
  name: string
  description: string | null
  priceLabel: string
  priceAmount: number | null
  durationMinutes: number
  bufferMinutes: number
  isActive: boolean
}
```

### QueueItemDto

Operational item shown in admin daily queue and customer queue views.

```ts
type QueueItemDto = {
  id: string
  shopId: string
  queueNumber: string
  queueDate: string
  customer: {
    id: string
    name: string
    phone: string
    lineId: string | null
  }
  service: {
    id: string
    name: string
    category: 'barber' | 'tattoo'
    durationMinutes: number
  }
  staff: {
    id: string
    name: string
  }
  source: 'online' | 'walk_in' | 'admin' | 'tattoo'
  status: QueueStatus
  startsAt: string | null
  endsAt: string | null
  estimatedWaitMinutes: number
  queueAhead: number
  bookingCode: string
  customerNote: string | null
  internalNote: string | null
  tattooRequestId: string | null
  createdAt: string
  updatedAt: string
}
```

```ts
type QueueStatus =
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'pending_review'
  | 'contacted'
  | 'cancelled'
  | 'no_show'
```

Status meaning:

- `confirmed` — booking exists but customer may not be physically at shop
- `checked_in` — customer arrived / walk-in accepted
- `in_progress` — staff is currently serving this queue
- `completed` — finished
- `pending_review` — tattoo request waiting for shop review
- `contacted` — shop contacted customer about tattoo request
- `cancelled` — cancelled
- `no_show` — customer missed booking/queue

### TattooRequestDto

Tattoo request is not a confirmed appointment.

```ts
type TattooRequestDto = {
  id: string
  shopId: string
  queueNumber: string
  customer: {
    id: string
    name: string
    phone: string
    lineId: string | null
  }
  preferredStaffId: string | null
  status: 'pending_review' | 'contacted' | 'confirmed' | 'cancelled'
  placement: string
  sizeEstimate: string
  budgetEstimate: string | null
  preferredDateText: string | null
  description: string
  referenceImages: ReferenceImageDto[]
  internalNote: string | null
  createdAt: string
  updatedAt: string
}
```

### BlockedTimeDto

```ts
type BlockedTimeDto = {
  id: string
  shopId: string
  staffId: string
  startsAt: string
  endsAt: string
  reason: string
  createdAt: string
}
```

## Public Endpoints

### GET `/shops/:shopSlug/public`

Returns shop details and active public services.

Response:

```json
{
  "shop": {
    "id": "shop_dream_catcher",
    "slug": "dream-catcher",
    "displayName": "Dream Catcher Barber & Tattoo",
    "phone": null,
    "address": "San Kamphaeng, Chiang Mai",
    "mapUrl": null,
    "timezone": "Asia/Bangkok",
    "status": "active",
    "todayHours": {
      "opensAt": "10:00",
      "closesAt": "20:00",
      "isClosed": false
    }
  },
  "services": []
}
```

### GET `/shops/:shopSlug/queue/today`

Returns today's public queue context.

Query params:

- `bookingCode` optional, to fetch a specific customer queue item
- `queueNumber` optional, to fetch a specific customer queue item

Response:

```json
{
  "date": "2026-06-17",
  "activeQueueCount": 3,
  "pendingTattooCount": 1,
  "nextQueueNumber": "A025",
  "estimatedWaitMinutes": 105,
  "queueAhead": 3,
  "current": {
    "queueNumber": "A022",
    "status": "in_progress"
  },
  "myQueue": null
}
```

### POST `/shops/:shopSlug/queue/tickets`

Creates a walk-in style queue ticket from the customer page.

Request:

```json
{
  "serviceId": "service_classic_haircut",
  "customerName": "ลูกค้าหน้าร้าน",
  "phone": "-",
  "customerNote": "รับบัตรคิวจากหน้าลูกค้า"
}
```

Response:

```json
{
  "queueItem": {
    "id": "qi_001",
    "queueNumber": "A025",
    "source": "walk_in",
    "status": "checked_in",
    "estimatedWaitMinutes": 105,
    "queueAhead": 3,
    "bookingCode": "QT-A025"
  }
}
```

### POST `/shops/:shopSlug/appointments`

Creates an advance barber booking.

Request:

```json
{
  "serviceId": "service_modern_fade",
  "staffId": "staff_arm",
  "startsAt": "2026-06-17T09:30:00.000Z",
  "customerName": "คุณต้น",
  "phone": "0891234567",
  "customerNote": "ขอช่างที่ถนัด fade"
}
```

Response:

```json
{
  "queueItem": {
    "id": "qi_002",
    "queueNumber": "A026",
    "source": "online",
    "status": "confirmed",
    "bookingCode": "DC-0930"
  }
}
```

Backend must reject overlapping staff appointments and blocked-time conflicts.

### POST `/shops/:shopSlug/tattoo-requests`

Creates a tattoo request for review.

Request:

```json
{
  "customerName": "คุณมายด์",
  "phone": "0812057746",
  "placement": "ต้นแขนด้านใน",
  "sizeEstimate": "เล็ก ประมาณ 5-8 ซม.",
  "budgetEstimate": "2,500-3,500",
  "preferredDateText": "เสาร์หน้า / หลัง 18:00",
  "description": "fineline ดอกไม้เล็ก ๆ โทนเรียบ",
  "referenceImageNames": ["rose-reference.png"]
}
```

Response:

```json
{
  "tattooRequest": {
    "id": "tr_001",
    "queueNumber": "T008",
    "status": "pending_review"
  },
  "queueItem": {
    "id": "qi_t008",
    "queueNumber": "T008",
    "source": "tattoo",
    "status": "pending_review",
    "bookingCode": "TR-008"
  }
}
```

## Admin Endpoints

V0 has no auth yet. Routes are still namespaced as `/admin` so the frontend boundary is clear.

### GET `/admin/shops/:shopSlug/queue/today`

Returns full admin daily queue state.

Response:

```json
{
  "date": "2026-06-17",
  "items": [],
  "blockedTimes": [],
  "summary": {
    "activeCount": 3,
    "checkedInCount": 1,
    "pendingTattooCount": 1,
    "inProgressQueueNumber": "A022"
  }
}
```

### PATCH `/admin/queue-items/:id/status`

Updates queue status.

Request:

```json
{
  "status": "in_progress"
}
```

Response:

```json
{
  "queueItem": {
    "id": "qi_001",
    "status": "in_progress"
  },
  "affectedItems": [
    {
      "id": "qi_previous",
      "status": "checked_in"
    }
  ]
}
```

Rules:

- `confirmed -> checked_in`
- `checked_in -> in_progress`
- `in_progress -> completed`
- `pending_review -> contacted -> confirmed`
- `confirmed | checked_in | pending_review -> cancelled`
- any active queue can become `no_show` except `completed`
- only one `in_progress` item per `staffId`
- if backend chooses auto-revert, previous `in_progress` becomes `checked_in`; if it chooses strict guard, return `IN_PROGRESS_EXISTS`

V0 recommendation: auto-revert current `in_progress` to `checked_in`, matching current prototype helper.

### POST `/admin/walk-ins`

Creates a walk-in from admin.

Request:

```json
{
  "shopSlug": "dream-catcher",
  "serviceId": "service_classic_haircut",
  "staffId": "staff_arm",
  "customerName": "ลูกค้าหน้าร้าน",
  "phone": "-",
  "internalNote": "เพิ่มจากหน้า admin"
}
```

Response:

```json
{
  "queueItem": {
    "id": "qi_003",
    "queueNumber": "A027",
    "source": "walk_in",
    "status": "checked_in",
    "bookingCode": "WI-A027"
  }
}
```

### POST `/admin/blocked-times`

Creates a blocked time range.

Request:

```json
{
  "shopSlug": "dream-catcher",
  "staffId": "staff_arm",
  "startsAt": "2026-06-17T11:15:00.000Z",
  "endsAt": "2026-06-17T12:00:00.000Z",
  "reason": "พัก/เคลียร์อุปกรณ์"
}
```

Response:

```json
{
  "blockedTime": {
    "id": "bt_001",
    "staffId": "staff_arm",
    "startsAt": "2026-06-17T11:15:00.000Z",
    "endsAt": "2026-06-17T12:00:00.000Z",
    "reason": "พัก/เคลียร์อุปกรณ์"
  }
}
```

Backend must prevent new appointments from overlapping blocked time. Whether it should allow creating a block over an existing appointment is an owner/product decision; V0 should return `BLOCKED_TIME_CONFLICT` unless admin explicitly adds a future override flag.

## Wait Estimate V0

Initial calculation:

```text
estimatedWaitMinutes = sum(durationMinutes of active barber queue items before this queue)
```

Active barber statuses:

- `confirmed`
- `checked_in`
- `in_progress`

Exclude:

- tattoo requests
- `completed`
- `cancelled`
- `no_show`

Later refinements:

- include blocked time before the target queue
- include buffer time
- use staff-specific queues if multiple bookable staff are active

## Backend Service Rules

### Queue number service

Inputs:

- `shopId`
- `queueDate`
- `prefix`

Output:

- next daily queue number

Must be transaction-safe when two users request a ticket at the same time.

### Status transition service

Owns all status mutation rules. Routes should not implement transitions directly.

### Appointment conflict service

Rejects overlaps for same `staffId` when:

- appointment overlaps another active appointment
- appointment overlaps blocked time
- shop/staff is closed

### Tattoo request service

Creates a `TattooRequest` and an operational `QueueItem` with the same `queueNumber` prefix `T` so admin daily queue can show it.

## Open Questions

- Owner confirmation for real service list, prices, and durations.
- Whether tattoo requests should always appear in daily queue or only in a review inbox.
- Whether blocked time can be created over an existing appointment with admin override.
- Whether queue numbers reset by local shop day or rolling 24-hour window. V0 assumes local shop day.
- Whether customer ticket lookup needs phone verification or only `bookingCode`.
