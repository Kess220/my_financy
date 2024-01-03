import { createTransaction } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import { Router } from 'express'

const transactionRouter: Router = Router()

transactionRouter.post('/', authenticateToken, createTransaction)

export { transactionRouter }
