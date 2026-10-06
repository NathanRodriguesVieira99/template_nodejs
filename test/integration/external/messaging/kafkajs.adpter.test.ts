import { KafkaJsAdapter } from "@/external/messaging/kafkajs.adapter.ts";
import type { MessageBroker } from "@/infra/messaging/message-broker.ts";

let sut: MessageBroker;

beforeAll(async () => {
  sut = new KafkaJsAdapter(
    [String(process.env.KAFKA_BROKER)],
    "groupId",
    "clientId",
  );
  await sut.connect();
});

afterAll(async () => {
  await sut.disconnect();
});

describe("KafkaJsAdapter", () => {
  it.todo("should produce and consume a message", async () => {});
});
