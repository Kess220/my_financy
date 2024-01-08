import { createTransaction, getAllTransactions } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import { Router } from 'express'

const transactionRouter: Router = Router()

transactionRouter.post('/', authenticateToken, createTransaction)
transactionRouter.get('/', authenticateToken, getAllTransactions)

export { transactionRouter }
