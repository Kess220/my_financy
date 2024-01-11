// Arquivo envs.ts
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

export function loadEnv() {
  let path = '.env'

  if (process.env.NODE_ENV === 'test') {
    path = '.env.test'
  } else if (process.env.NODE_ENV === 'development') {
    path = '.env.development'
  }

  const currentEnvs = dotenv.config({ path })
  dotenvExpand.expand(currentEnvs)

  console.log('DATABASE_URL:', process.env.DATABASE_URL)
}
