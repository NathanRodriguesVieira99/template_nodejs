import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";
const options = {
  host: process.env.LOKI_HOST,
  labels: {
    service_name: process.env.SERVICE_NAME,
    environment: process.env.NODE_ENV,
  },
};

const logger = pino({
  level: process.env.LOG_LEVEL,
  transport: isDev
    ? {
        targets: [
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: true,
              ignore: "pid,hostname",
            },
          },
          {
            target: "pino-loki",
            options,
          },
        ],
      }
    : {
        target: "pino-loki",
        options,
      },
});

export default logger;
