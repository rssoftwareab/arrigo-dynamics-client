import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import gql from "graphql-tag";
import WebSocket from "ws";
import { DynamicsClient } from "../client";
import { OnDataPayload } from "../client/OnDataPayload"
import { gqlquery, login } from "./APIhelper";

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
    cache: new InMemoryCache(),
    link,
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

  const dynamicsClient = new DynamicsClient();
  dynamicsClient.initialize({
    initialObject: content,
    onNewData: console.log
  });

  dynamicsClient.on("data", (_event: string, payload: OnDataPayload) => {
    console.log(
      `New data: path:${payload.path}, newValue:${payload.newValue}, oldValue:${payload.oldValue}`
    );
  });

  const observer = client.subscribe({
    query: subscriptionQuery
  });

  observer.subscribe({
    next(data) {
      dynamicsClient.patch(data.data.data.path, data.data.data.value);
    },
    error(err) {
      console.error("err", err);
    }
  });
  console.log(observer);
}

run();
