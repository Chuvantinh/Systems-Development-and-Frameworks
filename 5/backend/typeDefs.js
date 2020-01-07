const typeDefs = `
  enum State {
    ACTIVE
    DEACTIVE
  }
  enum Order {
    DESC
    ASC
  }
  type User{
    id: ID!
    username: String,
    password : String,
    role: String!
    token: String
  }
  
  type Product {
    id: ID!
    title: String!
    state: String
    category: Int
  }
  
  type Category {
    id: ID!
    title: String!
  }
  
  type Query {
    getCategoryByCategoryInProduct(category: Int!): Category
    getProduct(id: String!): Product
    getCategory(id: String!): Category
    getUser(username: String, password: String): User
  }
  
  type Mutation {
    createUser(id: ID, username: String, password : String,role: String!): User
    createProduct(id: ID, title: String!, state: String, category: Int): Product
    createCategory(id: ID, title: String!): Category
    createRelationship(id: ID!): Product
    deleteAll: Boolean
    login(username: String, password: String): String
  }
`;

module.exports = typeDefs;
