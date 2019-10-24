export const config: any = {
  auth: {
    account: process.env.ACCOUNT || "",
    password: process.env.API_PASSWORD || "exo",
    username: process.env.API_USERNAME || "ReginSe"
  },
  url: process.env.URL || "https://services.regin.se/ci/eos_beta/api/",
  ws: process.env.WS || "ws://172.18.149.35/eos_beta/api/graphql/ws"
};
