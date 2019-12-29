const uuid = require('uuid/v1');
const { neo4jgraphql } = require('neo4j-graphql-js');

const typeDefs = `
  enum State {
    DONE
    UNDONE
    IN_PROGRESS
  }
  enum Order {
    DESC
    ASC
  }
  type Todos {
    id: ID!
    message: String!
    state: State
    assignee: Assignee @relation(name: "ASSIGNED_TO", direction: "IN")
  }
  type Assignee {
    id: ID!
    name: String!
  }
  
  type Query {
    todos: [Todos]
    todo(id: ID!): Todos
    todosOrderedByState(sortOrder: Order!): [Todos]
    skipAndLimitTodo: [Todos]
  }
  type Mutation {
    createAssignee(id: ID, name: String!): Assignee
    createTodo(id: ID, message: String!, state: State): Todos
    createRelationship(id: ID!, name: String!): Todos
    deleteTodo(id: ID!): Todos
    deleteAllTodos: Boolean
    deleteAllAssignees: Boolean
    creatingAssignee(id: ID, name: String!): Assignee
    createRelationshipAndOtherNode: Assignee
  }
`;

const resolvers = {
    Query: {
        todos: async (object, args, context) => {
            const session = context.driver.session();

            try {
                const cypherQuery = 'MATCH (t:Todos) RETURN t';

                const result = await session.run(cypherQuery);
                const todos = result.records.map(record => record.get('t').properties);
                return todos;
            } finally {
                session.close();
            }
        },
        todo: async (object, args, context) => {
            const session = context.driver.session();

            try{
                const cypherQuery = 'MATCH (t:Todos)-[:ASSIGNED]->(a:Assignee) ' +
                    'WHERE t.id = $id RETURN t, a';
                const result = await session.run(cypherQuery, { id: args.id });
                const todo = result.records.map(record => record.get('t').properties)[0];
                return todo;
            } finally {
                session.close();
            }
        },
        todosOrderedByState: async (object, args, context) => {
            const session = context.driver.session();

            try {
                let cypherQuery = 'MATCH (t:Todos) RETURN t ORDER BY t.state ';
                if(args.sortOrder == 'DESC') {
                    cypherQuery += 'DESC';
                }

                const result = await session.run(cypherQuery);
                const todos = result.records.map(record => record.get('t').properties);
                return todos;
            } finally {
                session.close();
            }
        },
        skipAndLimitTodo : async (object, args, context) => {
            const session = context.driver.session();

            try {
                let cypherQuery = "MATCH (n:Todos) RETURN n SKIP 1 LIMIT 2";
                const result = await session.run(cypherQuery);
                let todos = result.records.map(record => record.get('n').properties);
                return todos;
            } finally {
                session.close();
            }
        }
    },
    Mutation: {
        createTodo: async (object, args, context, resolveInfo) => {
            const todoId = args.id || uuid();
            const todoState = args.state || 'UNDONE';

            const session = context.driver.session();
            try {
                const cypherCreation = 'CREATE (t:Todos { id: $todoId, message: $message, state: $state })';

                await session.run(cypherCreation, {
                    todoId: todoId,
                    message: args.message,
                    state: todoState
                });
                return true;
            }
            finally {
                session.close();
            }
        },
        createAssignee: async (object, args, context, resolveInfo) => {
            const assigneeId = args.id || uuid();

            const session = context.driver.session();
            try {
                const cypherCreation = 'CREATE (a:Assignee { id: $assigneeId, name: $name })';

                await session.run(cypherCreation, {
                    assigneeId: assigneeId,
                    name: args.name
                });
                return true;
            }
            finally {
                session.close();
            }
        },
        creatingAssignee: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();
            const id = args.id;
            const name = args.name;

            try {
                const cypherMerge = 'MERGE (star:Assignee { id: $id, name: $name}) Return star';
                return await session.run(cypherMerge, {
                        id: id,
                        name: name
                });
            }
            finally {
                session.close();
            }
        },
        createRelationship: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();

            try {
                const cypherRelation = 'MATCH (a:Assignee), (t:Todos) ' +
                    'WHERE a.name = $name AND t.id = $id ' +
                    'CREATE (t)-[r:ASSIGNED_TO]->(a) RETURN type(r)';

                await session.run(cypherRelation, {
                    name: args.name,
                    id: args.id
                });
                return true;
            } finally {
                session.close();
            }
        },

        createRelationshipAndOtherNode: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();

            try {
                const cypherRelation = 'MERGE (city:City { name: "Berlin" }) ' +
                    '                    MERGE (as:VanTinh { nam: "TINH_CHU"}) ' +
                    '                    MERGE (as)-[r:BORN_IN]->(city)' +
                    '                    RETURN as.name'

                await session.run(cypherRelation);
                return true;
            } finally {
                session.close();
            }
        },
        deleteTodo: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();
            try {
                const cypherDelete = 'MATCH (t:Todos) WHERE t.id = $id DELETE t';
                await session.run(cypherDelete, { id: args.id });
                return true;
            } finally {
                session.close();
            }
        },
        deleteAllTodos: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();
            try {
                const cypherDelete = 'MATCH (t:Todos) DETACH DELETE t';
                await session.run(cypherDelete);
                return true;
            } finally {
                session.close();
            }
        },
        deleteAllAssignees: async (object, args, context, resolveInfo) => {
            const session = context.driver.session();
            try {
                const cypherDelete = 'MATCH (a:Assignee) DETACH DELETE a';
                await session.run(cypherDelete);
            } finally {
                session.close();
            }
        }
    },
};

module.exports.typeDefs = typeDefs;
module.exports.resolvers = resolvers;
