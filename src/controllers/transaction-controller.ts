import { Response } from 'express'
import { transactionService } from '@/services'
import httpStatus from 'http-status'
import { AuthenticatedRequest } from '@/middlewares'

export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { value, type, description } = req.body
  const newTransaction = await transactionService.createTransaction(
    req,
    value,
    type,
    description,
  )
  res.status(httpStatus.CREATED).json(newTransaction)
}
export const getAllTransactions = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const historicTransactions =
    await transactionService.getAllTransactionsByUserId(req)
  res.status(httpStatus.OK).json(historicTransactions)
}
