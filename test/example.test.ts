import { expect, test, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    }) // antes de rodar os testes esse funcao aguarda o app ser iniciado, depois disso os testes podem ser executados
    
    afterAll(async () => {
        await app.close()
    }) // depois de rodar os testes esse funcao fecha o app
    
    test('should be able to create a new transaction', async () => {
    
        const response = await request(app.server).post('/transactions').send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })
    
        expect(response.statusCode).toEqual(201)
    })

    test('should be able to list all transactions', async () => {

        const createTransactionResponse = await request(app.server).post('/transactions').send({
            title: 'New transaction',
            amount: 5000,
            type: 'credit'
        })
        
        const cookies = createTransactionResponse.get('Set-Cookie')
        // if (cookies) {
        //   const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

        //     console.log(listTransactionsResponse.body)

        // } else {
        //   console.error('Nenhuma cookie encontrada na resposta');
        // }

        const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies?.[0] ?? '').expect(200) 
        // se cookies estiver vazio, pega o primeiro elemento do array
        // o metodo set espera um array de string ou uma string o cookie e um array de string | undefined, por isso tive que fazer o ?? '' para ele aceitar undefined

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            })
        ])
    })
})

// describe: grupos de testes / categorias
// test / it:
// beforeAll / afterAll: executados antes e depois de todos os testes
// beforeEach / afterEach: executados antes e depois de cada teste
// sempre fazer os testes sem um depender do outro, se depender era para ser um teste so.