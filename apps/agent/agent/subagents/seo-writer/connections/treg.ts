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
    "Treg: tool execution proxy providing web search, SERP data, People Also Ask (PAA) discovery, and competitor scraping for SEO and keyword research.",
  url: "https://treg.to/mcp",
});

