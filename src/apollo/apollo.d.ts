import "@apollo/client";

declare module "@apollo/client" {
  namespace ApolloClient {
    namespace DeclareDefaultOptions {
      interface WatchQuery {
        errorPolicy: "ignore" | "all" | "none";
      }
      interface Query {
        errorPolicy: "all" | "none" | "ignore";
      }
      interface Mutate {
        errorPolicy: "all" | "none" | "ignore";
      }
    }
  }
}