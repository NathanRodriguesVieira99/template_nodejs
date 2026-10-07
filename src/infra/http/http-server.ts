export namespace Http {
  export type Request = { params?: unknown; body?: unknown };
  export type Response = { status: Http.Status; body: unknown };
  export const methods = [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ] as const;
  export type Method = (typeof methods)[number];
  export enum Status {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
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
