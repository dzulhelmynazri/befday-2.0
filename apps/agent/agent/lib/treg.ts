import { defineMcpClientConnection } from "eve/connections";

export const createTregConnection = (description: string) =>
  defineMcpClientConnection({
    auth: {
      getToken: () =>
        Promise.resolve({
          // oxlint-disable-next-line typescript/no-non-null-assertion
          token: process.env.TREG_API_KEY!,
        }),
      principalType: "app",
    },
    description,
    url: "https://treg.to/mcp",
  });
