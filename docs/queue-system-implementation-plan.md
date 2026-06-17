# Queue System Implementation Plan

เอกสารนี้แปลง queue-first UX ให้เป็นแผน implementation สำหรับเฟสถัดไป ยังไม่ใช่ schema หรือ API contract สุดท้าย

## Core Concepts

### Queue Number

ลูกค้าและร้านควรอ้างอิงคิวด้วยหมายเลขเดียวกัน เช่น `A023`

Assumption:

- `A` ใช้กับคิวตัดผม/หน้าร้าน
- `T` ใช้กับ tattoo request หรือ tattoo consult
- เลขเริ่มนับใหม่รายวันต่อร้าน
- เลขคิวต้องไม่เปลี่ยนแม้สถานะเปลี่ยน

Open question:

- ต้องแยก prefix ตามบริการหรือช่างหรือไม่ เช่น `B` สำหรับ barber, `T` สำหรับ tattoo
- ถ้ามีหลายช่าง ควรเป็น queue กลางของร้านหรือ queue แยกตามช่าง

### Queue Item

Queue item ควรรวมข้อมูลที่ทั้ง customer และ admin ใช้ร่วมกัน:

- `shopId`
- `queueNumber`
- `customerId`
- `serviceId`
- `staffId`
- `source`: `online`, `walk_in`, `admin`, `tattoo`
- `status`
- `startsAt`
- `endsAt`
- `estimatedWaitMinutes`
- `queueAhead`
- `bookingCode`
- `customerNote`
- `internalNote`

## Status Flow

Barber queue:

1. `confirmed`
2. `checked_in`
3. `in_progress`
4. `completed`

Exception statuses:

- `cancelled`
- `no_show`

Tattoo request:

1. `pending_review`
2. `contacted`
3. `confirmed`
4. creates appointment or queue item

Rule:

- Only one queue item per staff should be `in_progress` at a time
- Moving a queue item to `in_progress` should require either completing the current one or explicitly pausing/reverting it

## Customer Flow

### Take Queue Ticket

1. Customer opens `/book/{shopSlug}`
2. Customer selects service
3. System creates a queue item with daily `queueNumber`
4. Customer sees ticket number, wait estimate, and queue ahead
5. Customer can open `My Queue`
6. System can notify customer through LINE when queue is close

### My Queue

Customer should see:

- Queue number
- Current status
- Estimated wait
- Queue ahead
- Timeline
- LINE notification state
- Cancel action

## Admin Flow

Admin should see the same queue number everywhere:

- Now serving card
- Next queue card
- Queue board row
- Queue detail panel
- Customer lookup

Admin actions:

- Add walk-in
- Call next queue
- Check in
- Start service
- Complete service
- Mark no-show
- Cancel queue
- Confirm tattoo request into an appointment

## Wait Estimate

Initial MVP estimate can be simple:

```text
estimatedWaitMinutes = sum(durationMinutes of active queue items before this queue)
```

Rules to refine later:

- Include blocked time if it falls before the queue
- Include buffer time if configured
- Separate by staff if queues are staff-specific
- Recalculate when admin changes status

## LINE Notification

MVP can store notification intent before integration:

- `lineConnected`
- `lineUserId`
- `notifyWhenQueueAheadLessThanOrEqual`
- `lastNotificationSentAt`

Trigger candidates:

- Queue created
- Queue ahead becomes 3 or fewer
- Queue is called
- Queue is no-show/cancelled

## Next Implementation Steps

Current frontend prototype helper:

- `app/src/lib/queue-system.ts` contains mock-safe queue helpers for active queue filtering, queue number generation, walk-in creation, visible queue filtering, and status transition guard.
- This helper is not a backend service yet, but it documents the domain shape the backend should preserve.

UI component direction:

- Use local shadcn-style primitives under `app/src/components/ui/` for repeated controls and surfaces before adding raw buttons, cards, badges, inputs, labels, selects, switches, or textareas in feature code.
- Keep the ticket visual treatment as product-specific styling, but compose it with the same primitive layer when it is used as a reusable UI surface.

1. Add queue number fields to real data model/schema
2. Build queue number generation service
3. Build status transition service with one-active-staff guard
4. Build wait estimate calculation
5. Build admin queue mutation API
6. Build customer ticket lookup by booking code or queue number
7. Add LINE notification integration after owner confirms channel setup
