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
    this.producer = kafka.producer();
    this.consumer = kafka.consumer({ groupId });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async produce<P>(message: Message<P>): Promise<void> {
    await this.producer.send({
      topic: message.name,
      messages: [{ key: message.id, value: JSON.stringify(message) }],
    });
  }

  async consume<P>(
    name: string,
    handler: (message: Message<P>) => Promise<void>,
  ): Promise<void> {
    await this.consumer.subscribe({ topic: name });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const event = JSON.parse(message.value.toString()) as Message<P>;
        await handler(event);
      },
    });
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }
}
