import fastify from 'fastify'
import { knex } from './database'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'



const app = fastify()

app.register(cookie)
app.register(transactionsRoutes, { prefix: '/transactions' })

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running on port 3333')
  })
 