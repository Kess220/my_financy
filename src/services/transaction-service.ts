import { invalidInputError, notFoundError } from '@/errors'
import { AuthenticatedRequest } from '@/middlewares'
import { transactionRepository, walletRepository } from '@/repositories'
import { Transaction } from '@prisma/client'
interface TransactionService {
  createTransaction(
    req: AuthenticatedRequest,
    value: number,
    transactionType: 'deposit' | 'withdrawal',
    description?: string,
  ): Promise<Transaction>
  getAllTransactionsByUserId(req: AuthenticatedRequest): Promise<Transaction[]>
}

async function createTransaction(
  req: AuthenticatedRequest,
  value: number,
  transactionType: 'deposit' | 'withdrawal',
  description?: string,
): Promise<Transaction> {
  const userId = req.userId
  const wallet = await walletRepository.getWalletByUserId(userId)

  if (!wallet) {
    throw notFoundError('Wallet not found.')
  }

  if (isNaN(value) || value <= 0) {
    throw invalidInputError('Invalid transaction amount')
  }

  if (transactionType === 'withdrawal' && value > wallet.balance) {
    throw invalidInputError('Insufficient funds for withdrawal')
  }

  if (!['deposit', 'withdrawal'].includes(transactionType)) {
    throw invalidInputError('Invalid transaction type')
  }

  if (transactionType === 'withdrawal' && wallet.balance < value) {
    throw invalidInputError('Insufficient funds for withdrawal')
  }

  if (description && description.length > 100) {
    throw invalidInputError(
      'Description exceeds maximum length (100 characters)',
    )
  }

  if (description !== undefined && typeof description !== 'string') {
    throw invalidInputError('Description must be a string')
  }

  return transactionRepository.createTransaction(
    wallet.id,
    value,
    transactionType,
    description,
  )
}

async function getAllTransactionsByUserId(
  req: AuthenticatedRequest,
): Promise<any[]> {
  const userId = req.userId
  const transactions =
    await transactionRepository.getAllTransactionsByUserId(userId)

  return transactions
}

export const transactionService: TransactionService = {
  createTransaction,
  getAllTransactionsByUserId,
}
