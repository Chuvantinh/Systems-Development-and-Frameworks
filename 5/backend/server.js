const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolver')

const { applyMiddleware } = require('graphql-middleware')
const neo4j = require('neo4j-driver');
const { makeAugmentedSchema } = require('neo4j-graphql-js')
const permissions = require('./shield')

const schema = applyMiddleware(
    makeAugmentedSchema({
        typeDefs,
        resolvers
    }),
    permissions,
)

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', '1234')
);
const decode = async (driver, token) => {

    const JWT = require('jsonwebtoken');
    const SECRET = "Friday for future";

    var object_decode = await  JWT.verify(token, SECRET)
    if(object_decode){
        const username = object_decode.username
        const password = object_decode.password
        const session = driver.session()
        const cypherQuery = 'MATCH (u:User) ' +
            'where u.username = $username  and u.password = $password ' +
            'RETURN u';
        const result = await session.run(cypherQuery, {username: username, password: password});
        const data = result.records.map(record => record.get('u').properties)[0];
        session.close()
        if(data){
            return {data}
        }else{
            return null
        }
    }else{
        return null
    }
}

module.exports = new ApolloServer({
    schema: schema,
    context: async ({ req }) => {
        let user;
        if(typeof  req !== "undefined"){
            if( typeof req.headers.authorization == "undefined" ){
                user = null
            }else{
                user = await decode(driver, req.headers.authorization);
            }
        }else{
            user = null
        }

        return {
            driver,
            req,
            user: user
        }
    },
})

//token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIxMjM0In0.qXkwDG2BDK5nQVVjJVtDmcu0y4sRVrDnPlf0Klxm5tM
// payload: {
//     "username": "admin",
//      "password": "1234"
// }