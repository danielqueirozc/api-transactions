import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import crypto from 'node:crypto'
import { json } from "node:stream/consumers"

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })
  
  app.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first() // first: pega o primeiro se nao tiver ele retorna undefined

    return { transaction }
  })

  app.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()
  })

  app.post('/', async (request, reply) => {
       const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(['credit', 'debit']),
       })

       const { title, amount, type } = createTransactionBodySchema.parse(request.body)

       let sessionId = request.cookies.sessionId

       if (!sessionId) {
          sessionId = crypto.randomUUID()

          reply.cookie('sessionId', sessionId, {
            path: '/', //path: quais rotas do backend vao poder acessar esses cookies
            maxAge: 60 * 60 * 24 * 7, // 7 days
          })
       }

       await knex('transactions').insert({
        id: crypto.randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
       })

       return reply.status(201).send()
      })
}