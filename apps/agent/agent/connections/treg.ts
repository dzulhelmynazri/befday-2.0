import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  auth: {
    principalType: "app",
    getToken: async () => ({
      token: process.env.TREG_API_KEY!,
    }),
  },
  description:
    "Treg: tool execution proxy and API registry providing access to web search, scraping, social data, enrichment, and external tools.",
  url: "https://treg.to/mcp",
});
