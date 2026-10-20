import nock from "nock";
import sinon from "sinon";
import axios from "axios";
import { Http } from "@/infra/http/http-server.ts";
import { AxiosAdapter } from "@/external/http/axios.adapter.ts";
import type { HttpClient } from "@/infra/http/http-client.ts";

let sut: HttpClient;

beforeAll(() => {
  sut = new AxiosAdapter();
});

afterEach(() => {
  nock.cleanAll();
  sinon.restore();
});

describe("AxiosAdapter", () => {
  it("should make a successful GET request", async () => {
    const url = "http://localhost:3000/api/v1";
    const endpoint = "/test";
    const responseHttpCode = Http.Status.OK;
    const responseBody = { data: "test data" };
    nock(url).get(endpoint).reply(responseHttpCode, responseBody);
    const getSpy = sinon.spy(axios, "request");
    const response = await sut.request<typeof responseBody, never>({
      url,
      endpoint,
      method: "GET",
      body: undefined,
      params: undefined,
      headers: undefined,
    });
    expect(getSpy.calledOnce).toBeTruthy();
    expect(
      getSpy.calledWith({
        url: `${url}${endpoint}`,
        method: "GET",
        data: undefined,
        params: undefined,
        headers: undefined,
      }),
    ).toBeTruthy();
    expect(response).toEqual(responseBody);
  });
  it("should make a successful GET request with query params and headers", async () => {
    const url = "http://localhost:3000/api/v1";
    const endpoint = "/test";
    const responseHttpCode = Http.Status.OK;
    const params = { page: 1, perPage: 10 };
    const headers = { "Content-Type": "application/json" };
    const responseBody = { data: "test data" };
    nock(url).get(endpoint).query(params).reply(responseHttpCode, responseBody);
    const getSpy = sinon.spy(axios, "request");
    const response = await sut.request<typeof responseBody, never>({
      url,
      endpoint,
      method: "GET",
      body: undefined,
      params,
      headers,
    });
    expect(getSpy.calledOnce).toBeTruthy();
    expect(
      getSpy.calledWith({
        url: `${url}${endpoint}`,
        method: "GET",
        data: undefined,
        params,
        headers,
      }),
    ).toBeTruthy();
    expect(response).toEqual(responseBody);
  });
  it("should make a successful POST request", async () => {
    const url = "http://localhost:3000/api/v1";
    const endpoint = "/test";
    const responseHttpCode = Http.Status.OK;
    const requestBody = { data: "test data" };
    const responseBody = { data: "test data" };
    nock(url).post(endpoint).reply(responseHttpCode, responseBody);
    const getSpy = sinon.spy(axios, "request");
    const response = await sut.request<typeof responseBody, typeof requestBody>({
      url,
      endpoint,
      method: "POST",
      body: requestBody,
      params: undefined,
      headers: undefined,
    });
    expect(getSpy.calledOnce).toBeTruthy();
    expect(
      getSpy.calledWith({
        url: `${url}${endpoint}`,
        method: "POST",
        data: requestBody,
        params: undefined,
        headers: undefined,
      }),
    ).toBeTruthy();
    expect(response).toEqual(responseBody);
  });
  it("should make a successful POST request without body", async () => {
    const url = "http://localhost:3000/api/v1";
    const endpoint = "/test";
    const responseHttpCode = Http.Status.OK;
    const requestBody = null;
    const responseBody = { data: "test data" };
    nock(url).post(endpoint).reply(responseHttpCode, responseBody);
    const getSpy = sinon.spy(axios, "request");
    const response = await sut.request<typeof responseBody, typeof requestBody>({
      url,
      endpoint,
      method: "POST",
      body: requestBody,
      params: undefined,
      headers: undefined,
    });
    expect(getSpy.calledOnce).toBeTruthy();
    expect(
      getSpy.calledWith({
        url: `${url}${endpoint}`,
        method: "POST",
        data: requestBody,
        params: undefined,
        headers: undefined,
      }),
    ).toBeTruthy();
    expect(response).toEqual(responseBody);
  });
  it.todo("should make a successful DELETE request", async () => {});
  it.todo("should make a successful PUT request", async () => {});
  it.todo("should make a successful PATCH request", async () => {});
});
