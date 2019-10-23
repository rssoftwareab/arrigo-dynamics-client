import fetch from "node-fetch"
import { config } from "../../../../config/config"
import { login } from "../auth/getToken"

export async function executeQuery(query: string) {
  const authToken = await login(config.auth.account, config.auth.username, config.auth.password);
  
  return fetch(`${config.url}graphql`, {
    body: JSON.stringify({
      operationname: null,
      query,
      variables: null,
    }),
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    method: "POST"
  })
    .then(res => res.json())
    .catch(console.log);
}
