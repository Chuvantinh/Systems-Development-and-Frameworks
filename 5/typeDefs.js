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
  
  type Product{
    id: ID!
    cat_id: Category
    title: String!
    matchcode : String
    barcode: Int
    unit: String
    price: Float
    color: String
    image : String
  }
  
  type Category{
    id: ID!
    title: String!
  }
  
  type Role{
      type: String
      role: String
  }
  
  type Query {
    getTodoByAssigneeName(assignee: String!): Todos
    getAssigneeByAssigneeIDwithShield(assignee: String!): Assignee
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
