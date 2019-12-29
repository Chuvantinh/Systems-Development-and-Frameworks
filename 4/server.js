const { ApolloServer } = require('apollo-server');
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { typeDefs, resolvers } = require('./typedefs');
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
);

const schema = makeAugmentedSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
});

module.exports = new ApolloServer({ schema, context: { driver } });