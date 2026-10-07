import { FastifyAdapter } from "./external/http/fastify.adapter.ts";
import { PGPromiseAdapter } from "./external/database/pg-promise.adapter.ts";
import { KafkaJsAdapter } from "./external/messaging/kafkajs.adapter.ts";
import type { HttpServer } from "./infra/http/http-server.ts";
import type { DatabaseConnection } from "./infra/database/database-connection.ts";
import type { MessageBroker } from "./infra/messaging/message-broker.ts";

const httpServer: HttpServer = new FastifyAdapter();
const databaseConnection: DatabaseConnection = new PGPromiseAdapter(
  String(process.env.DATABASE_URL),
);
const messageBroker: MessageBroker = new KafkaJsAdapter(
  [String(process.env.KAFKA_BROKER)],
  "groupId",
  "clientId",
);
await messageBroker.connect();
httpServer.listen(3000);

let isShuttingDown = false;
const gracefulShutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  try {
    await httpServer.close();
    await messageBroker.disconnect();
    await databaseConnection.close();
    console.log("Application terminated");
  } catch (error: any) {
    console.error(
      `Error on shutdown application: ${error.message}, stack: ${error.stack}`,
    );
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
