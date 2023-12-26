import 'reflect-metadata'
import 'express-async-errors'
import express, { Express } from 'express'
import cors from 'cors'

import { loadEnv, disconnectDB } from '@/config'

loadEnv()

const app = express()
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))

export function init(): Promise<Express> {
  return Promise.resolve(app)
}

export async function close(): Promise<void> {
  await disconnectDB()
}

export default app
