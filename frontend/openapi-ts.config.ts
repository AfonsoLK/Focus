import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "legacy/axios",
  input: `http://localhost:8000/api/openapi.json`,
  output: { path: "services", format: "prettier" },
  plugins: [
    {
      name: "@hey-api/typescript",
      enums: "javascript",
    },
    {
      name: "@hey-api/sdk",
      asClass: true,
      operationId: true,
    },
  ],
});
