import axios, { type AxiosError, type AxiosInstance } from "axios";
import type { HttpClient, HttpRequest } from "@/infra/http/http-client.ts";
import { Http } from "@/infra/http/http-server.ts";

export class AxiosAdapter implements HttpClient {
  private instance: AxiosInstance;
  constructor() {
    this.instance = axios;
  }

  async request<Response, RequestBody>({
    url,
    endpoint,
    method,
    headers,
    params,
    body,
  }: HttpRequest<RequestBody>): Promise<Response> {
    try {
      const { data } = await this.instance.request<Response>({
        url: `${url}${endpoint}`,
        method,
        headers,
        data: body,
        params,
      });
      return data;
    } catch (er) {
      const error = er as AxiosError;
      const status =
        error.response?.status ?? Http.Status.INTERNAL_SERVER_ERROR;
      const message = error.response?.data ?? error.message;
      throw new Error(`Request failed with status ${status} : ${message}`);
    }
  }
}
