import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers/index.js";
import { createContext } from "./context.js";
import { initDb } from "./db.js";

async function main() {
  await initDb();

  const server = new ApolloServer({ typeDefs, resolvers });

  const port = Number(process.env.PORT) || 4000;

  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: createContext,
  });

  console.log(`Server running at ${url}`);
}

void main();
