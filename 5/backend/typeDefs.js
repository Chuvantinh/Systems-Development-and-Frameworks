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
    role: String!
    token: String
  }
  
  type Product {
    id: ID!
    tite: String!
    state: State
    category: Int
  }
  
  type Category {
    id: ID!
    title: String!
  }
  
  type Query {
    getProductByCategory(id: Int!): Product
    getProduct(id: String!): Product
    getCategory(id: String!): Category
  }
  
  type Mutation {
    createUser(id: ID, role: String!, token: String): User
    createProduct(id: ID, title: String!, state: String, category: Int): Product
    createCategory(id: ID, title: String!): Category
    createRelationship(id: ID!): Product
    deleteALL: Product
  }
`;

module.exports = typeDefs;
