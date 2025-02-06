import fastify from 'fastify'
import { knex } from './database'

const app = fastify()

app.get('/hello', async (req, res) => {
  // const tables = await knex('sqlite_schema').select('*')

  // return tables

  // npx knex migrate:latest

  //  const transaction = knex('transactions').insert({
  //     id: crypto.randomUUID(),
  //     title: 'New transaction',
  //     amount: 5000,
  //    }).returning('*')

  //    return transaction

  const transactions = await knex('transactions')
    .where('amount', '>', 5000)
    .select('*')

  return transactions
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running on port 3333')
  })
