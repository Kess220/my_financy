import { createWallet, getWalletById, updateWalletBalance } from '@/controllers'
import { authenticateToken } from '@/middlewares'
import { Router } from 'express'

const walletRouter: Router = Router()

walletRouter.post('/create', authenticateToken, createWallet)
walletRouter.get('/', authenticateToken, getWalletById)
walletRouter.put('/update', authenticateToken, updateWalletBalance)

export { walletRouter }
