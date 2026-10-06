import type { Knex } from "knex";

export default {
  client: "pg",
  connection: String(process.env.DATABASE_URL),
  migrations: {
    directory: "./src/infra/migrations",
  },
} satisfies Knex.Config;
