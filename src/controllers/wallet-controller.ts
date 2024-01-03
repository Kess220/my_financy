import { Response } from 'express'
import { walletService } from '@/services'
import httpStatus from 'http-status'
import { AuthenticatedRequest } from '@/middlewares'

export const createWallet = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const newWallet = await walletService.createWallet(req)
  res.status(httpStatus.CREATED).json(newWallet)
}

export const getWalletById = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const infoWallet = await walletService.getWalletByUserId(req)
  res.status(httpStatus.OK).json(infoWallet)
}

export const updateWalletBalance = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { newBalance } = req.body

  const updateBalanceWallet = await walletService.updateWalletBalance(
    req,
    newBalance,
  )
  res.status(httpStatus.OK).json(updateBalanceWallet)
}
