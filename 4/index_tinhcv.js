const { ApolloServer } = require('apollo-server');
var neo4j = require('neo4j-driver');

const { makeAugmentedSchema } = require('neo4j-graphql-js');
const { neo4jgraphql } = require('neo4j-graphql-js');


const typeDefs = `
  enum State {
    DONE
    UNDONE
    IN_PROGRESS
  }

  type Todo {
    id: ID!
    message: String
    state: State
    assigneeId: ID
  }
  type Assignee {
    id: ID!
    name: String
  }
  
  type User {
  id: ID!
  name: String
}
  
  type Query {
    getTodosByID(id: ID!): Todo,
    getUser (id: Int!): [User]
  }
  
  type Mutation {
    createTodo(id: ID, message: String!, state: State, assigneeId: ID): Todo
    createAssignee(name: String!): Assignee
    updateTodo(id: ID!, message: String, state: State, assigneeId: ID): Todo
    updateAssignee(id: ID!, name: String): Assignee
    deleteTodo(id: ID!): Boolean
    deleteTodosForAssignee(assigneeeId: ID!): Boolean
    deleteAssignee(id: ID!): Boolean
  }
`;

const resolvers = {
    // root entry point to GraphQL service
    Query: {
        getTodosByID(object, params, ctx, resolveInfo) {
            async function runQuery() {
                const session = driver.session();
                const result = await session.run('Match (todo:Todos) where id = {id} return todo.message as message', { id: 1 })
                session.close();
                return result.records[0].get(0);
            }

            async function test() {
                const queryResult = await runQuery();
                console.log(queryResult);
                driver.close();
            }
            test()
        },
        getUser(object, params, ctx, resolveInfo) {
            return neo4jgraphql(object, params, ctx, resolveInfo);
        }
    },
    Mutation: {
        createTodo(object, params, ctx, resolveInfo){
            //return neo4jgraphql(object, params, ctx, resolverInfo, true);
        }
    }
};

const schema = makeAugmentedSchema({
    typeDefs,
    resolvers
});

const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('neo4j', 'anhyeuemA123')
);


const server = new ApolloServer({ schema, context: { driver } });

server.listen(3004, '0.0.0.0').then(({ url }) => {
    console.log(`GraphQL API ready at ${url}`);
});