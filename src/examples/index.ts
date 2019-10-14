//import { DynamicsClient } from "../client";

import { login, gqlquery } from "./APIhelper";
import { ApolloClient } from "apollo-client";
import gql from "graphql-tag";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import WebSocket from "ws";

async function run() {
  const authToken = await login("", "ReginSe", "exo");

  console.log(authToken);
  const res = await gqlquery(
    `{
  folder(id: "QXJlYV9B") {
    name
    ...on UserArea {
      publicVariableList {
        name
        uid
      }		
    }
  }
}`,
    authToken
  );

  const pvl = res.data.folder.publicVariableList[1];
  console.log("public variable lists", pvl);

  const fileQuery = await gqlquery(
    `{data(uid:"${pvl.uid}"){content}}`,
    authToken
  );
  const content = fileQuery.data.data.content;
  console.log("filecontent", content);

  const link = new WebSocketLink({
    uri: "ws://172.18.149.35/eos_beta/api/graphql/ws",

    options: {
      reconnect: true
    },
    webSocketImpl: WebSocket
  });

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  const subscriptionQuery = gql`
  subscription {
    data(uid:"${pvl.uid}")
    {
      path
      type
      value
    }
  }`;

  const observer = client.subscribe({
    query: subscriptionQuery
  });
  console.log(subscriptionQuery);

  observer.subscribe({
    next(data) {
      console.log("data", `${data.data.data.path}:${data.data.data.value}`);
    },
    error(err) {
      console.error("err", err);
    }
  });
  console.log(observer);
}

run();
