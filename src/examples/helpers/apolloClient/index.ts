import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import WebSocket from "ws";
import { config } from "../../../config/config"

export async function apolloClient() {
  const link = new WebSocketLink({
    options: {
      reconnect: true
    },
    uri: config.ws,
    webSocketImpl: WebSocket,
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  return client;
}