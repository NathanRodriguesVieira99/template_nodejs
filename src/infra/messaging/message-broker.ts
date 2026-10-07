export interface Message<Payload = unknown> {
  id: string;
  name: string;
  payload: Payload;
  occurredAt: Date;
}

export interface MessageBroker {
  connect(): Promise<void>;
  produce<Payload>(message: Message<Payload>): Promise<void>;
  consume<Payload>(
    name: string,
    handler: (consumedMessage: Message<Payload>) => Promise<void>,
  ): Promise<void>;
  disconnect(): Promise<void>;
}
