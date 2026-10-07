import { randomUUID } from "node:crypto";
import { KafkaJsAdapter } from "@/external/messaging/kafkajs.adapter.ts";
import type {
  Message,
  MessageBroker,
} from "@/infra/messaging/message-broker.ts";

let sut: MessageBroker;

beforeAll(async () => {
  sut = new KafkaJsAdapter(
    [String(process.env.KAFKA_BROKER)],
    `test-groupId`,
    `test-clientId`,
  );
  await sut.connect();
});

afterAll(async () => {
  await sut.disconnect();
});

describe("KafkaJsAdapter", () => {
  it("should produce and consume a message", async () => {
    let counter = 0;
    const payload = {
      id: randomUUID(),
      username: "fake name",
      age: 21,
    };
    const message: Message<typeof payload> = {
      id: randomUUID(),
      name: `test-topic-${randomUUID()}`,
      occurredAt: new Date(),
      payload,
    };
    let receivedMessage: Message<typeof payload> | undefined;
    await sut.produce<typeof payload>(message);
    await new Promise<void>((resolve, reject) => {
      sut
        .consume<typeof payload>(
          message.name,
          async (consumedMessage: Message<typeof payload>) => {
            counter++;
            receivedMessage = consumedMessage;
            resolve();
          },
        )
        .catch(reject);
    });
    expect(counter).toBe(1);
    expect(receivedMessage).toEqual(message);
  });
});
