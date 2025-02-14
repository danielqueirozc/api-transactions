import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)

// app.addHook('preHandler', async (request, reply) => {
//   const sessionId = request.cookies.sessionId

//   if (!sessionId) {
//     return reply.status(401).send({
//       error: 'Unauthorized',
//     })
//   }
// }) hook global, funciona em todas as rotas

app.register(transactionsRoutes, { prefix: '/transactions' })


