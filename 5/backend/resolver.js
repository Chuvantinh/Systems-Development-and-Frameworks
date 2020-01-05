const jwt = require('jsonwebtoken');
const uuid = require('uuid/v1');

const resolvers = {
    Query: {
        hello : (object, args, context) => {
            return {
                message: "Hello word"
            };
        },
        getAssigneeByTodo : async (object, args, context) => {
            const session = context.driver.session();

            try{
                const cypherQuery = 'MATCH (t:Todos { id: $id })-->(a:Assignee)' +
                    'RETURN a';
                const result = await session.run(cypherQuery, { id: args.id });
                const data = result.records.map(record => record.get('a').properties)[0];
                return data;
            } finally {
                session.close();
            }
        },
        getTodobyID: async (object, args, context) => {
            const session = context.driver.session();

            try{
                const cypherQuery = 'MATCH (t:Todos)' +
                    'where t.id = $id ' +
                    'RETURN t';
                const result = await session.run(cypherQuery, { id: args.id });
                const todo = result.records.map(record => record.get('t').properties)[0];
                return todo;
            } finally {
                session.close();
            }
        },
    },
    Mutation: {
        createTodo: async (object, args, context, resolveInfo) => {
            const todoId = args.id || uuid();
            const todoState = args.state || 'UNDONE';

            const session = context.driver.session();
            try {
                const cypherCreation = 'CREATE (t:Todos { id: $todoId, message: $message, state: $state, assignee: $assignee })';

                await session.run(cypherCreation, {
                    todoId: todoId,
                    message: args.message,
                    state: todoState,
                    assignee: args.assignee
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
                const cypherCreation = 'CREATE (a:Assignee { id: $assigneeId, name: $name, role: $role, token: $token })';

                await session.run(cypherCreation, {
                    assigneeId: assigneeId,
                    name: args.name,
                    role: args.role,
                    token: args.token,
                });
                return true;
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

module.exports = resolvers;