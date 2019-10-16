import fetch from "node-fetch"
import { config } from "../../../../config/config"

export async function login(
  account: string|void,
  username: string|void,
  password: string|void,
) {
  const credentials = await fetch(
    `${config.url}login`,
    {
      body: JSON.stringify({
        account,
        password,
        username,
      }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "Post"
    }
  )
    .then(res => res.json())
    .catch(console.log);

  const authToken = credentials.authToken;
  console.log("credentials:", authToken, "x");
  return authToken;
}