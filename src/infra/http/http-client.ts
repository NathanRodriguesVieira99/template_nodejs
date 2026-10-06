import type { Http } from "./http-server.ts";

export type HttpRequest<RequestBody = unknown> = {
  endpoint: string;
  method: Http.Method;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  body?: RequestBody;
};

export interface HttpClient {
  request: <Response, RequestBody>({
    endpoint,
    method,
    headers,
    params,
    body,
  }: HttpRequest<RequestBody>) => Promise<Response>;
}
