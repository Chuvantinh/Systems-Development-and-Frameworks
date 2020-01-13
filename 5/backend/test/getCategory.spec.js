const { gql } = require('apollo-server')
const {createTestClient} = require('apollo-server-testing');
const neo4j = require('neo4j-driver');

const createServer = require('../createServer.js')

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
);

const { server } = createServer({
    context: () => {
        return {
            user: null,
            driver,
        }
    },
})

const { query } = createTestClient(server)

describe('QUERY', () => {

    it('getCategroy by ID with null user', async () => {
        const querygetCategory = gql`query getCategory ($id: String!)
        {getCategory (id : $id){ id, title }}`;

        await expect(query({query: querygetCategory, variables: {id: "1"}})).resolves.toMatchObject({
            errors: [{ message: 'ERORR NOT ADMIN' }]
        })
    })
});