export const typeDefs = `#graphql
  type Entry {
    id: ID!
    name: String!
    phone: String!
  }

  input EntryInput {
    name: String!
    phone: String!
  }

  type AuthPayload {
    token: String!
  }

  type Query {
    entries: [Entry!]!
    search(term: String!): [Entry!]!
    checkDuplicate(name: String!, phone: String!): Boolean!
    checkUsernameAvailable(username: String!): Boolean!
  }

  type Mutation {
    signup(username: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    guestLogin: AuthPayload!
    addEntry(input: EntryInput!): Entry!
  }
`;
