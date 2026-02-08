import { authResolvers } from "./auth.js";
import { phonebookResolvers } from "./phonebook.js";

export const resolvers = {
  Query: {
    ...phonebookResolvers.Query,
    ...authResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...phonebookResolvers.Mutation,
  },
};
