import {
  ConnectionAuthorizationRequiredError,
  defineMcpClientConnection,
} from "eve/connections";

export default defineMcpClientConnection({
  auth: {
    getToken: () => {
      const token = process.env.TREG_API_KEY;

      if (!token) {
        throw new ConnectionAuthorizationRequiredError("treg", {
          message:
            "TREG_API_KEY environment variable is required to authenticate with Treg MCP.",
        });
      }

      return Promise.resolve({ token });
    },
    principalType: "app",
  },
  description:
    "Treg: tool execution proxy and API registry providing access to web search, scraping, social data, enrichment, and external tools.",
  url: "https://treg.to/mcp",
});
