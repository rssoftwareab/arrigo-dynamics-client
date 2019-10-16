import fetch from "node-fetch";

console.log("running example");

export async function login(
  account: string,
  username: string,
  password: string
) {
  const credentials = await fetch(
    "https://services.regin.se/ci/eos_beta/api/login",
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

export async function gqlquery(query: string, authToken: string) {
  return fetch("https://services.regin.se/ci/eos_beta/api/graphql", {
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
