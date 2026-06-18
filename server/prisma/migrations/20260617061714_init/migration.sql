-- CreateEnum
CREATE TYPE "ShopStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('barber', 'tattoo_artist', 'owner');

-- CreateEnum
CREATE TYPE "StaffStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('barber', 'tattoo');

-- CreateEnum
CREATE TYPE "QueueSource" AS ENUM ('online', 'walk_in', 'admin', 'tattoo');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('confirmed', 'checked_in', 'in_progress', 'completed', 'pending_review', 'contacted', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "TattooRequestStatus" AS ENUM ('pending_review', 'contacted', 'confirmed', 'cancelled');

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "mapUrl" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Bangkok',
    "status" "ShopStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "phone" TEXT,
    "isBookable" BOOLEAN NOT NULL DEFAULT true,
    "status" "StaffStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "category" "ServiceCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceLabel" TEXT NOT NULL,
    "priceAmount" DECIMAL(10,2),
    "durationMinutes" INTEGER NOT NULL,
    "bufferMinutes" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "lineId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueItem" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "queueNumber" TEXT NOT NULL,
    "queueDate" DATE NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "source" "QueueSource" NOT NULL,
    "status" "QueueStatus" NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "estimatedWaitMinutes" INTEGER NOT NULL DEFAULT 0,
    "queueAhead" INTEGER NOT NULL DEFAULT 0,
    "bookingCode" TEXT NOT NULL,
    "customerNote" TEXT,
    "internalNote" TEXT,
    "tattooRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TattooRequest" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "queueNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "preferredStaffId" TEXT,
    "status" "TattooRequestStatus" NOT NULL DEFAULT 'pending_review',
    "placement" TEXT NOT NULL,
    "sizeEstimate" TEXT NOT NULL,
    "budgetEstimate" TEXT,
    "preferredDateText" TEXT,
    "description" TEXT NOT NULL,
    "internalNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TattooRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceImage" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "tattooRequestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferenceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessHours" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "staffId" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "opensAt" TEXT NOT NULL,
    "closesAt" TEXT NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockedTime" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyQueueCounter" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "queueDate" DATE NOT NULL,
    "prefix" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyQueueCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_slug_key" ON "Shop"("slug");

-- CreateIndex
CREATE INDEX "Staff_shopId_idx" ON "Staff"("shopId");

-- CreateIndex
CREATE INDEX "Service_shopId_category_idx" ON "Service"("shopId", "category");

-- CreateIndex
CREATE INDEX "Customer_shopId_phone_idx" ON "Customer"("shopId", "phone");

-- CreateIndex
CREATE INDEX "QueueItem_shopId_queueDate_status_idx" ON "QueueItem"("shopId", "queueDate", "status");

-- CreateIndex
CREATE INDEX "QueueItem_staffId_startsAt_endsAt_idx" ON "QueueItem"("staffId", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "QueueItem_shopId_queueDate_queueNumber_key" ON "QueueItem"("shopId", "queueDate", "queueNumber");

-- CreateIndex
CREATE UNIQUE INDEX "QueueItem_shopId_bookingCode_key" ON "QueueItem"("shopId", "bookingCode");

-- CreateIndex
CREATE INDEX "TattooRequest_shopId_status_idx" ON "TattooRequest"("shopId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "TattooRequest_shopId_queueNumber_key" ON "TattooRequest"("shopId", "queueNumber");

-- CreateIndex
CREATE INDEX "ReferenceImage_shopId_idx" ON "ReferenceImage"("shopId");

-- CreateIndex
CREATE INDEX "ReferenceImage_tattooRequestId_idx" ON "ReferenceImage"("tattooRequestId");

-- CreateIndex
CREATE INDEX "BusinessHours_shopId_dayOfWeek_idx" ON "BusinessHours"("shopId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessHours_shopId_staffId_dayOfWeek_key" ON "BusinessHours"("shopId", "staffId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "BlockedTime_shopId_startsAt_endsAt_idx" ON "BlockedTime"("shopId", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "BlockedTime_staffId_startsAt_endsAt_idx" ON "BlockedTime"("staffId", "startsAt", "endsAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyQueueCounter_shopId_queueDate_prefix_key" ON "DailyQueueCounter"("shopId", "queueDate", "prefix");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_tattooRequestId_fkey" FOREIGN KEY ("tattooRequestId") REFERENCES "TattooRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TattooRequest" ADD CONSTRAINT "TattooRequest_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TattooRequest" ADD CONSTRAINT "TattooRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TattooRequest" ADD CONSTRAINT "TattooRequest_preferredStaffId_fkey" FOREIGN KEY ("preferredStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferenceImage" ADD CONSTRAINT "ReferenceImage_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferenceImage" ADD CONSTRAINT "ReferenceImage_tattooRequestId_fkey" FOREIGN KEY ("tattooRequestId") REFERENCES "TattooRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessHours" ADD CONSTRAINT "BusinessHours_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedTime" ADD CONSTRAINT "BlockedTime_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockedTime" ADD CONSTRAINT "BlockedTime_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyQueueCounter" ADD CONSTRAINT "DailyQueueCounter_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
