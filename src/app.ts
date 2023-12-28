import 'reflect-metadata'
import express, { Express } from 'express'
import cors from 'cors'
import { userRouter, authenticationRouter } from '@/routes'

import { loadEnv, disconnectDB } from '@/config'
import { handleApplicationErrors } from '@/middlewares'

loadEnv()

const app = express()
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', userRouter)
  .use('/auth', authenticationRouter)
  .use(handleApplicationErrors)

export function init(): Promise<Express> {
  return Promise.resolve(app)
}

export async function close(): Promise<void> {
  await disconnectDB()
}

export default app
