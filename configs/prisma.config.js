import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasources: {
    db: {
      // Use env vars here
      url: process.env.DATABASE_URL,
      directUrl: process.env.DIRECT_URL, // optional
    },
  },
});
