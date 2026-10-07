import type { DatabaseConnection } from "@/infra/database/database-connection.ts";
import pgPromise from "pg-promise";

export class PGPromiseAdapter implements DatabaseConnection {
  private readonly connection: pgPromise.IDatabase<{}>;
  constructor(databaseURL: string) {
    this.connection = pgPromise()(databaseURL);
  }

  async query(statement: string, params: any[]): Promise<any> {
    const normalizedStatement = this.normalizeStatement(statement);
    const rows = await this.connection.query(normalizedStatement, params);
    return rows;
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }

  private normalizeStatement(statement: string): string {
    let index = 0;
    return statement.toLocaleLowerCase().replace(/\?/gi, () => `$${++index}`);
  }
}
