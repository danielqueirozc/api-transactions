import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"
import crypto from 'node:crypto'
import { CheckSessionIdExists } from "../middlewares/check-session-id-exists"

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [CheckSessionIdExists] }, async (request, reply) => {
    const {  sessionId } = request.cookies

    const transactions = await knex('transactions').where('session_id', sessionId).select()

    return { transactions }
  })
  
  app.get('/:id', { preHandler: [CheckSessionIdExists] }, async (request) => {
    const { session_id } = request.cookies
   
    const getTransactionParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where({
      session_id: session_id,
      id
    }).first() // first: pega o primeiro se nao tiver ele retorna undefined

    return { transaction }
  })

  app.get('/summary', { preHandler: [CheckSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies  
    
    const summary = await knex('transactions').where('session_id', sessionId)
      .sum('amount', { as: 'amount' })
      .first()

      return { summary }
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