import type { DatabaseConnection } from "@/infra/database/database-connection.ts";
import pgPromise from "pg-promise";

export class PGPromiseAdapter implements DatabaseConnection {
  private readonly connection: pgPromise.IDatabase<{}>;
  constructor(databaseURL: string) {
    this.connection = pgPromise()(databaseURL);
  }

  async query(statement: string, params: any[]): Promise<any> {
    const rows = await this.connection.query<Response[]>(statement, params);
    return rows;
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
