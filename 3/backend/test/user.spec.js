const {gql} = require('apollo-server')
const server = require('../server.js')
const {createTestClient} = require('apollo-server-testing');
const jwt = require('jsonwebtoken');

const {query, mutate} = createTestClient(server);

describe('Query: Graphql-shield with graphql-middleware to implement a permission layer around app', () => {

    const queryTodoLength = gql`query getCountTodos {countTodos}`;
    it('get all todo items at startup', () => {
        query({query: queryTodoLength}).then((result) => {
            expect(result.data.countTodos).toBe(6);
        })
    })
});
