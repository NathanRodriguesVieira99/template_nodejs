import { FastifyAdapter } from "./external/http/fastify.adapter.ts";
import { PGPromiseAdapter } from "./external/database/pg-promise.adapter.ts";
import { KafkaJsAdapter } from "./external/messaging/kafkajs.adapter.ts";

const httpServer = new FastifyAdapter();
const databaseConnection = new PGPromiseAdapter(
  String(process.env.DATABASE_URL),
);
const messageBroker = new KafkaJsAdapter(
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
