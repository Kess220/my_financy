import { Wallet } from '@prisma/client'
import { walletRepository } from '@/repositories/index'
import {
  UserAlreadyHasWalletError,
  invalidInputError,
  notFoundError,
} from '@/errors'
import { AuthenticatedRequest } from '@/middlewares'

async function createWallet(req: AuthenticatedRequest): Promise<Wallet> {
  const userId = req.userId

  if (!userId) {
    throw invalidInputError('User ID not provided in the request context.')
  }

  const existingWallet = await walletRepository.getWalletByUserId(userId)
  if (existingWallet) {
    throw UserAlreadyHasWalletError()
  }

  return walletRepository.createWallet(userId)
}

async function getWalletByUserId(
  req: AuthenticatedRequest,
): Promise<Wallet | null> {
  const userId = req.userId

  if (!userId) {
    throw notFoundError('User ID not provided in the request context.')
  }

  return walletRepository.getWalletByUserId(userId)
}

async function updateWalletBalance(
  req: AuthenticatedRequest,
  newBalance: number,
): Promise<Wallet | null> {
  const userId = req.userId

  if (!userId) {
    throw invalidInputError('User ID not provided in the request context.')
  }

  if (typeof newBalance !== 'number' || isNaN(newBalance)) {
    throw invalidInputError(
      'Invalid newBalance. Please provide a valid number.',
    )
  }

  const wallet = await walletRepository.updateWalletBalance(userId, newBalance)
  validateWalletExistence(wallet)

  return wallet
}

function validateWalletExistence(wallet: Wallet | null): void {
  if (!wallet) {
    throw notFoundError('Wallet not found.')
  }
}

function validateSufficientBalance(balance: number, amount: number): void {
  if (balance < amount) {
    throw invalidInputError('Insufficient balance to perform the operation.')
  }
}

export const walletService = {
  createWallet,
  getWalletByUserId,
  updateWalletBalance,
  validateWalletExistence,
  validateSufficientBalance,
}
