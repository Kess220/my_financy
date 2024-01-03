import { invalidInputError, notFoundError } from '@/errors'
import { AuthenticatedRequest } from '@/middlewares'
import { transactionRepository } from '@/repositories'
import { Transaction } from '@prisma/client'

interface TransactionService {
  createTransaction(
    req: AuthenticatedRequest,
    value: number,
    transactionType: 'deposit' | 'withdrawal',
    description?: string,
  ): Promise<Transaction>
  getTransactionsByUserId(userId: number): Promise<Transaction[]>
}

async function createTransaction(
  req: AuthenticatedRequest,
  value: number,
  transactionType: 'deposit' | 'withdrawal',
  description?: string,
): Promise<Transaction> {
  const userId = req.userId
  const wallet = await transactionRepository.getWalletByUserId(userId)

  if (!wallet) {
    throw notFoundError('Wallet not found.')
  }

  if (value <= 0) {
    throw invalidInputError('Negative values are not allowed')
  }

  if (!['deposit', 'withdrawal'].includes(transactionType)) {
    throw invalidInputError('Invalid transaction type')
  }

  return transactionRepository.createTransaction(
    wallet.id,
    value,
    transactionType,
    description,
  )
}

async function getTransactionsByUserId(userId: number): Promise<Transaction[]> {
  return transactionRepository.getTransactionsByUserId(userId)
}

export const transactionService: TransactionService = {
  createTransaction,
  getTransactionsByUserId,
}
