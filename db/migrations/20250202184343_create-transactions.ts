import type { Knex } from "knex";

// up = criar a tabela
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) => {
        table.uuid('id').primary()
        table.text('text').notNullable()
        table.decimal('amount', 10, 2).notNullable() // 10 digitos e 2 casas decimais // notNullable() nao pode ser nulo e obrigatorio
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // knex.fn.now() pega a data e hora atual de uma forma que nao seja exclusivo de um banco especifico
    })
}


// down = deletar a tabela / tudo que eu criar ou fazer no up o down vai ser o contrário
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

