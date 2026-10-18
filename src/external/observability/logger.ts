import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL,
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
  },
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: true,
          ignore: "pid,hostname",
        },
      }
    : {
        target: "pino-loki",
        options: {
          host: process.env.LOKI_HOST,
          endpoint: "/loki/api/v1/push",
          labels: {
            service_name: process.env.OTEL_SERVICE_NAME,
            environment: process.env.NODE_ENV,
          },
        },
      },
});

export default logger;
