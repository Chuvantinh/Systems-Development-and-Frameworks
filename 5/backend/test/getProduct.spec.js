const { gql } = require('apollo-server')
const {createTestClient} = require('apollo-server-testing');
const neo4j = require('neo4j-driver');

const createServer = require('../createServer.js')

driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
);
const User =
    {
        data: {password: '1234', role: 'Admin', id: '1', username: 'admin'}
    }

const {server} = createServer({
    context: () => ({
        driver,
        user: User,
    }),
})

const { query } = createTestClient(server)

describe('QUERY', () => {
    it('Get Product by ID of Product', async () => {
        const querygetProduct = gql`query getProduct ($id: String!)
        {getProduct (id : $id){ id, title }}`;

        await query({query: querygetProduct, variables: {id: "2"}}).then((result) => {
            expect(result.data.getProduct.title).toBe('Rock');
        });
    })
});