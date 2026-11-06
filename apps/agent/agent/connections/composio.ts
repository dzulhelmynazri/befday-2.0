import { defineMcpClientConnection } from "eve/connections";

export default defineMcpClientConnection({
  auth: {
    getToken: () =>
      Promise.resolve({
        // oxlint-disable-next-line typescript/no-non-null-assertion
        token: process.env.COMPOSIO_API_KEY!,
      }),
    principalType: "app",
  },
  description:
    "Composio: integration hub for Google Maps, Play Store, App Store, and Google Sheets.",
  url: "https://backend.composio.dev/v1/mcp",
});
