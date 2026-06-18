import type { Prisma } from '@prisma/client'

type TransactionClient = Prisma.TransactionClient

export const getNextQueueNumber = async (tx: TransactionClient, shopId: string, queueDate: Date, prefix: string) => {
  const counter = await tx.dailyQueueCounter.upsert({
    where: {
      shopId_queueDate_prefix: {
        shopId,
        queueDate,
        prefix,
      },
    },
    create: {
      shopId,
      queueDate,
      prefix,
      lastNumber: 1,
    },
    update: {
      lastNumber: {
        increment: 1,
      },
    },
    select: {
      lastNumber: true,
    },
  })

  return `${prefix}${String(counter.lastNumber).padStart(3, '0')}`
}
