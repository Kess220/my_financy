// transactionRepository.ts
import { PrismaClient, Transaction, Wallet } from '@prisma/client'

const prisma = new PrismaClient()

interface TransactionRepository {
  createTransaction(
    walletId: number,
    value: number,
    transactionType: 'deposit' | 'withdrawal',
    description?: string,
  ): Promise<Transaction>
  getTransactionsByUserId(userId: number): Promise<Transaction[]>
  getWalletByUserId(userId: number): Promise<Wallet | null>
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

    // Cria a transação
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

async function getTransactionsByUserId(userId: number): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    where: {
      userId,
    },
  })
}

async function getWalletByUserId(userId: number): Promise<Wallet | null> {
  return prisma.wallet.findFirst({
    where: {
      userId,
    },
  })
}

export const transactionRepository: TransactionRepository = {
  createTransaction,
  getTransactionsByUserId,
  getWalletByUserId,
}
