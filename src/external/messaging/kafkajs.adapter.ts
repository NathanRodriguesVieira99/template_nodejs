import { Kafka, type Consumer, type Producer } from "kafkajs";
import type {
  Message,
  MessageBroker,
} from "@/infra/messaging/message-broker.ts";

export class KafkaJsAdapter implements MessageBroker {
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  constructor(brokers: string[], groupId: string, clientId: string) {
    const kafka = new Kafka({ brokers, clientId });
    this.producer = kafka.producer({ allowAutoTopicCreation: true });
    this.consumer = kafka.consumer({ groupId, allowAutoTopicCreation: true });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async produce<Payload>(message: Message<Payload>): Promise<void> {
    const topic = message.name;
    const messages = [{ key: message.id, value: JSON.stringify(message) }];
    await this.producer.send({ topic, messages });
  }

  async consume<Payload>(
    name: string,
    handler: (consumedMessage: Message<Payload>) => Promise<void>,
  ): Promise<void> {
    await this.consumer.subscribe({ topic: name, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ message: kafkaMessage }) => {
        if (!kafkaMessage.value) return;
        const parsedMessage = JSON.parse(kafkaMessage.value.toString());
        const consumedMessage: Message<Payload> = {
          ...parsedMessage,
          occurredAt: new Date(parsedMessage.occurredAt),
        };
        await handler(consumedMessage);
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
