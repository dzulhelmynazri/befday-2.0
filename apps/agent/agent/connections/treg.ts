import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  auth: {
    getToken: () =>
      Promise.resolve({
        // oxlint-disable-next-line typescript/no-non-null-assertion
        token: process.env.TREG_API_KEY!,
      }),
    principalType: "app",
  },
  description:
    "Treg: tool execution proxy and API registry providing access to web search, scraping, social data, enrichment, and external tools.",
  url: "https://treg.to/mcp",
});
