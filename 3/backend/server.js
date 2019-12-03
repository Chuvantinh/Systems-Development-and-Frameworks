const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/typeDefs/typeDefs');
const resolvers = require('./src/shema/resolvers/resolver')

const { applyMiddleware } = require('graphql-middleware')
const { makeExecutableSchema } = require('graphql-tools')

const permissions = require('./src/shield');

const schema = applyMiddleware(
    makeExecutableSchema({
        typeDefs,
        resolvers,
    }),
    permissions,
)

module.exports = new ApolloServer({
    schema,
    cors: {
        origin: '*',
        methods: 'GET,HEAD,POST',
    },})