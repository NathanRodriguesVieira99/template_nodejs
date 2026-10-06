import { PGPromiseAdapter } from "@/external/database/pg-promise.adapter.ts";
import type { DatabaseConnection } from "@/infra/database/database-connection.ts";

let sut: DatabaseConnection;

beforeAll(() => {
  sut = new PGPromiseAdapter(String(process.env.DATABASE_URL));
});

afterAll(async () => {
  await sut.close();
});

describe("PGPromiseAdapter", () => {
  it("should make a query on database and return data", async () => {
    const [row] = await sut.query(`SELECT 1 as result`, []);
    expect(row.result).toBe(1);
  });
  it("should work with params on SQL", async () => {
    const param = 3;
    const [row] = await sut.query(`SELECT ? as result`, [param]);
    expect(row.result).toBe(param);
  });
});
