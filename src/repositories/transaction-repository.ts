import { PrismaClient, Transaction } from '@prisma/client'

const prisma = new PrismaClient()

interface TransactionRepository {
  createTransaction(
    walletId: number,
    value: number,
    transactionType: 'deposit' | 'withdrawal',
    description?: string,
  ): Promise<Transaction>
  getAllTransactionsByUserId(userId: number): Promise<Transaction[]>
}

async function createTransaction(
  walletId: number,
  value: number,
  transactionType: 'deposit' | 'withdrawal',
  description?: string,
): Promise<Transaction> {
  return prisma.$transaction(async (tx) => {
    await tx.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: {
          increment: transactionType === 'deposit' ? value : -value,
        },
      },
    })

    return tx.transaction.create({
      data: {
        walletId,
        userId: walletId,
        value,
        type: transactionType,
        description,
      },
    })
  })
}

async function getAllTransactionsByUserId(
  userId: number,
): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    orderBy: {
      date: 'asc',
    },
  })
}

export const transactionRepository: TransactionRepository = {
  createTransaction,
  getAllTransactionsByUserId,
}
