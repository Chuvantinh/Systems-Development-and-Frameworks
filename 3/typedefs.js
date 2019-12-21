const { gql } = require('apollo-server');

const typeDefs = gql`

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

  type Query {
    assignees(token: String!): [Assignee]
    assignee(id: ID!): Assignee
    todos: [Todo]
    todo(id: ID!): Todo
    todosForAssigneeId(assigneeId: ID!): [Todo]
    countTodos: Int
    countAssignees: Int
    todosByState(state: State!): [Todo]
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

module.exports = typeDefs;