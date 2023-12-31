import { createWallet, getWalletById } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import { Router } from 'express'

const walletRouter: Router = Router()

walletRouter.post('/create', authenticateToken, createWallet)
walletRouter.get('/', authenticateToken, getWalletById)

export { walletRouter }
