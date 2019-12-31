const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolver')

const { applyMiddleware } = require('graphql-middleware')
const neo4j = require('neo4j-driver');
const { makeAugmentedSchema } = require('neo4j-graphql-js')

const permissions = require('./shield')

//const decode = require('./decode')

const schema = applyMiddleware(
    makeAugmentedSchema({
        typeDefs,
        resolvers,
    }),
    //permissions,
)

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
);


const decode = async (driver, req) => {
    console.log(req.get.authorization);

    try {
        //name is {name;vantinh}, security is angichua
        let decoded = await jwt.verify(req.headers.authorization, 'angichua')
        if(decoded.name = "vantinh"){
            const session = driver.session()
            const cypherQuery = 'MATCH (a:Assignee) ' +
                'where a.token = $token ' +
                'RETURN a';
            const result = await session.run(cypherQuery, { token: token});
            const data = result.records.map(record => record.get('a').properties)[0];

            return {
                data
            }
        }
    } catch (err) {
        return null
    }
}

module.exports = new ApolloServer({
    schema: schema,
    context: async ({ req }) => {
        const user = await decode(driver, req);
        return {
            driver, req, user
        }
    },
})