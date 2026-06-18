import type { QueueStatus } from '@prisma/client'
import { HttpError } from '../errors/http-error.js'
import { prisma } from '../prisma-client.js'

const queueStatuses = [
  'confirmed',
  'checked_in',
  'in_progress',
  'completed',
  'pending_review',
  'contacted',
  'cancelled',
  'no_show',
] as const satisfies readonly QueueStatus[]

const terminalStatuses: QueueStatus[] = ['completed', 'cancelled', 'no_show']

const directTransitions: Record<QueueStatus, QueueStatus[]> = {
  confirmed: ['checked_in', 'cancelled', 'no_show'],
  checked_in: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed', 'cancelled', 'no_show'],
  completed: [],
  pending_review: ['contacted', 'confirmed', 'cancelled', 'no_show'],
  contacted: ['confirmed', 'cancelled', 'no_show'],
  cancelled: [],
  no_show: [],
}

const tattooRequestStatuses = ['pending_review', 'contacted', 'confirmed', 'cancelled'] as const

export const isQueueStatus = (status: unknown): status is QueueStatus => {
  return typeof status === 'string' && queueStatuses.includes(status as QueueStatus)
}

const assertTransitionAllowed = (currentStatus: QueueStatus, nextStatus: QueueStatus) => {
  if (currentStatus === nextStatus) return

  if (terminalStatuses.includes(currentStatus)) {
    throw new HttpError(409, 'INVALID_STATUS_TRANSITION', `Cannot move ${currentStatus} queue to ${nextStatus}`)
  }

  if (!directTransitions[currentStatus].includes(nextStatus)) {
    throw new HttpError(409, 'INVALID_STATUS_TRANSITION', `Cannot move ${currentStatus} queue to ${nextStatus}`)
  }
}

export const updateQueueItemStatus = async (id: string, status: QueueStatus) => {
  const existingItem = await prisma.queueItem.findUnique({
    where: { id },
    select: {
      id: true,
      staffId: true,
      status: true,
      tattooRequestId: true,
    },
  })

  if (!existingItem) {
    throw new HttpError(404, 'QUEUE_ITEM_NOT_FOUND', `Queue item ${id} was not found`)
  }

  assertTransitionAllowed(existingItem.status, status)

  return prisma.$transaction(async (tx) => {
    const affectedItems: Array<{ id: string; status: QueueStatus }> = []

    if (status === 'in_progress') {
      const previousInProgressItems = await tx.queueItem.findMany({
        where: {
          staffId: existingItem.staffId,
          status: 'in_progress',
          NOT: { id: existingItem.id },
        },
        select: { id: true },
      })

      if (previousInProgressItems.length > 0) {
        await tx.queueItem.updateMany({
          where: {
            id: { in: previousInProgressItems.map((item) => item.id) },
          },
          data: { status: 'checked_in' },
        })

        affectedItems.push(...previousInProgressItems.map((item) => ({ id: item.id, status: 'checked_in' as QueueStatus })))
      }
    }

    const queueItem = await tx.queueItem.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        tattooRequestId: true,
        updatedAt: true,
      },
    })

    if (queueItem.tattooRequestId && tattooRequestStatuses.includes(status as (typeof tattooRequestStatuses)[number])) {
      await tx.tattooRequest.update({
        where: { id: queueItem.tattooRequestId },
        data: { status: status as (typeof tattooRequestStatuses)[number] },
      })
    }

    return {
      queueItem: {
        id: queueItem.id,
        status: queueItem.status,
        updatedAt: queueItem.updatedAt.toISOString(),
      },
      affectedItems,
    }
  })
}
