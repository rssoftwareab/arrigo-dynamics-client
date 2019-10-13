//import { DynamicsClient } from "../client";

import { login, gql } from "./APIhelper";
async function run() {
  const authToken = await login("", "ReginSe", "exo");

  console.log(authToken);
  const res = await gql(
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

  const pvl = res.data.folder.publicVariableList[0];
  console.log("public variable lists", pvl);

  const fileQuery = await gql(`{data(uid:"${pvl.uid}"){content}}`, authToken);
  const content = fileQuery.data.data.content;
  console.log("filecontent", content);
}

run();
