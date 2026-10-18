import logger from "@/external/observability/logger.ts";
import pgPromise from "pg-promise";
import type { DatabaseConnection } from "@/infra/database/database-connection.ts";

export class PGPromiseAdapter implements DatabaseConnection {
  private readonly connection: pgPromise.IDatabase<{}>;
  constructor(databaseURL: string) {
    this.connection = pgPromise()(databaseURL);
    logger.info("PostgreSQL database connected");
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
