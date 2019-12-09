const { ApolloServer } = require('apollo-server');
const typeDefs = require('./typedefs.js');
const resolvers = require('./resolvers.js')

module.exports = new ApolloServer({ typeDefs, resolvers });