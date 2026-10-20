import { FastifyOtelInstrumentation } from "@fastify/otel";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { KafkaJsInstrumentation } from "@opentelemetry/instrumentation-kafkajs";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_DEPLOYMENT_ENVIRONMENT_NAME,
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: process.env.SERVICE_NAME,
  [ATTR_SERVICE_VERSION]: process.env.SERVICE_VERSION,
  [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: process.env.NODE_ENV,
});

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
});

const instrumentations = [
  new FastifyOtelInstrumentation({ registerOnInitialization: true }),
  new HttpInstrumentation(),
  new KafkaJsInstrumentation(),
  new PgInstrumentation(),
  new PinoInstrumentation(),
];

const metricReader = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  }),
});

const sdk = new NodeSDK({
  resource,
  traceExporter,
  instrumentations,
  metricReader,
});
sdk.start();

process.on("SIGINT", () => sdk.shutdown());
process.on("SIGTERM", () => sdk.shutdown());
