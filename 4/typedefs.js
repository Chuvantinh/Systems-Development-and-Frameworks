const uuid = require('uuid/v1');

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

  type Todo {
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
    todos: [Todo]
    todo(id: ID!): Todo
    todosOrderedByState(sortOrder: Order!): [Todo]
  }

  type Mutation {
    createAssignee(id: ID, name: String!): Assignee
    createTodo(id: ID, message: String!, state: State): Todo
    createRelationship(id: ID!, name: String!): Todo
    deleteTodo(id: ID!): Todo
    deleteAllTodos: Boolean
    deleteAllAssignees: Boolean
  }

`;

const resolvers = {
  Query: {
    todos: async (object, args, context) => {
      const session = context.driver.session();
      
      try {
        const cypherQuery = 'MATCH (t:Todo) RETURN t';

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
        const cypherQuery = 'MATCH (t:Todo)-[:ASSIGNED_TO]->(a:Assignee) ' +
                            'WHERE t.id = $id RETURN t, a';

        const result = await session.run(cypherQuery, { id: args.id });
        const todo = result.records.map(record => record.get('t').properties)[0];
        //const assignee = result.records.map(record => record.get('a').properties)[0];
        //todo.assignee = assignee;
        return todo;
      } finally {
        session.close();
      }
    },
    todosOrderedByState: async (object, args, context) => {
      const session = context.driver.session();

      try {
        let cypherQuery = 'MATCH (t:Todo) RETURN t ORDER BY t.state ';
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
  },
  Mutation: {
    createTodo: async (object, args, context, resolveInfo) => {
      const todoId = args.id || uuid();
      const todoState = args.state || 'UNDONE';

      const session = context.driver.session();
      try {
        const cypherCreation = 'CREATE (t:Todo { id: $todoId, message: $message, state: $state })';

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
    createRelationship: async (object, args, context, resolveInfo) => {
      const session = context.driver.session();

      try {
        const cypherRelation = 'MATCH (a:Assignee), (t:Todo) ' +
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
        const cypherDelete = 'MATCH (t:Todo) WHERE t.id = $id DELETE t';
        await session.run(cypherDelete, { id: args.id });
        return true;
      } finally {
        session.close();
      }
    },
    deleteAllTodos: async (object, args, context, resolveInfo) => {
      const session = context.driver.session();
      try {
        const cypherDelete = 'MATCH (t:Todo) DETACH DELETE t';
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