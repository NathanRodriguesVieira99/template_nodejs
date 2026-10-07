import pino from "pino";

const logger = pino({
  formatters: {
    level: (label) => {
      return { label: label.toUpperCase() };
    },
  },
});

export default logger;
