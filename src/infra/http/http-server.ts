export namespace Http {
  export type Request = { params?: unknown; body?: unknown };
  export type Response = { status: Http.Status; body: unknown };
  export const AcceptedMethodsList = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ] as const;
  export type Method = (typeof AcceptedMethodsList)[number];
  export enum Status {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
  }
}

export interface HttpServer {
  listen(port: number): void;
  close(): Promise<void>;
  register(
    method: Http.Method,
    url: string,
    callback: (request: Http.Request) => Promise<Http.Response>,
  ): void;
}
