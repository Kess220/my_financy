// walletRepository.ts
import { PrismaClient, Wallet } from '@prisma/client'

const prisma = new PrismaClient()

interface WalletRepository {
  createWallet(userId: number): Promise<Wallet>
  getWalletByUserId(userId: number): Promise<Wallet | null>
  updateWalletBalance(
    walletId: number,
    newBalance: number,
  ): Promise<Wallet | null>
}

async function createWallet(userId: number): Promise<Wallet> {
  return prisma.$transaction(async (tx) => {
    return tx.wallet.create({
      data: {
        userId,
      },
    })
  })
}

async function getWalletByUserId(userId: number): Promise<Wallet | null> {
  const wallet = await prisma.wallet.findFirst({
    where: {
      userId: userId,
    },
  })

  return wallet ?? null
}

async function updateWalletBalance(
  userId: number,
  newBalance: number,
): Promise<Wallet | null> {
  const wallet = await prisma.$transaction(async (tx) => {
    return tx.wallet.update({
      where: {
        userId: userId,
      },
      data: {
        balance: newBalance,
      },
    })
  })

  return wallet
}

export const walletRepository: WalletRepository = {
  createWallet,
  getWalletByUserId,
  updateWalletBalance,
}
