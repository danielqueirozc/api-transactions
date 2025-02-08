import 'dotenv/config'
import { z } from 'zod'

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
