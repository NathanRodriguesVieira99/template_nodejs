import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import { Http, type HttpServer } from "../../infra/http/http-server.ts";

export class FastifyAdapter implements HttpServer {
  private app: FastifyInstance;

  constructor() {
    this.app = fastify();
    this.app.register(fastifyCors, {
      origin: true,
      methods: [...Http.AcceptedMethodsList],
    });
  }

  listen(port: number): void {
    this.app.listen({ port });
    console.log(
      `Server running with Fastify on port ${port} at http://localhost:${port}`,
    );
  }

  async close(): Promise<void> {
    await this.app?.close();
  }

  register(
    method: Http.Method,
    url: string,
    callback: (request: Http.Request) => Promise<Http.Response>,
  ): void {
    this.app.route({
      method,
      url,
      handler: async (request, reply) => {
        const input: Http.Request = {
          params: request.params,
          body: request.body,
        };
        try {
          const output = await callback(input);
          reply.status(output.status).send(output.body);
        } catch (error: any) {
          // TODO
        }
      },
    });
  }
}
