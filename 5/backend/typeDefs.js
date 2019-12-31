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
    assignee: String
  }
  
  type Assignee {
    id: ID!
    name: String!
    role: String!
    token: String
  }
  
  type Role{
      type: String
      role: String
  }
  
  type Hello{
        message: String
  }
  
  type Query {
    getAssigneeByTodo(assignee: String!): Assignee
    getTodobyID(id: String!): Todos
    hello: Hello
  }
  
  type Mutation {
    createAssignee(id: ID, name: String!, role: String, token: String): Assignee
    createTodo(id: ID, message: String!, state: State, assignee: String): Todos
    createRelationship(id: ID!, name: String!): Todos
    deleteTodo(id: ID!): Todos
    deleteAllTodos: Boolean
    deleteAllAssignees: Boolean
  }
`;

module.exports = typeDefs;
