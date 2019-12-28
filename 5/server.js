const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolver')

const { applyMiddleware } = require('graphql-middleware')
const neo4j = require('neo4j-driver');
const { makeAugmentedSchema } = require('neo4j-graphql-js')

const permissions = require('./shield')

const decode = require('./decode')

const schema = applyMiddleware(
    makeAugmentedSchema({
        typeDefs,
        resolvers,
    }),
    permissions,
)

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
);

const context = async ({ req }) => {
   // const user = req.headers.authorization? req.headers.authorization : "Tinh2";
    const user = await decode.decode(driver, req)
    return {
        driver,
        user,
        req,
    }
}

module.exports = new ApolloServer({
    schema,
    context,
    cors: {
        origin: '*',
        methods: 'GET,HEAD,POST',
    },})