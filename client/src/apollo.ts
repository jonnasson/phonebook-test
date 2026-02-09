import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";

const httpLink = new HttpLink({ uri: "/graphql" });

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...(prevContext.headers as Record<string, string>),
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
