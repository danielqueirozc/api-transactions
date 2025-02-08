import { FastifyInstance } from "fastify"
import { knex } from "../database"

export async function transactionsRoutes(app: FastifyInstance) {
    app.post('/', async () => {
        const transactions = await knex('transactions')
          .where('amount', '>', 5000)
          .select('*')

          return transactions
      })

}