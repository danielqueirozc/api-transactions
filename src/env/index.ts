import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else (
  config()
)

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data

// parse: pega o process e verifica se tem o forrmato certo de acordo com o schema && dispara && para o codigo
// safeParse: pega o process e verifica se tem o forrmato certo de acordo com o schema && nao dispara um erro && nao para o codigo
// enum: uma entre algumas opcoes

//nao e obrigatorio colocar o NODE_ENV=test porque o vitest preenche automaticamente (somente quando estou executando os testes) no arquivo .env.test