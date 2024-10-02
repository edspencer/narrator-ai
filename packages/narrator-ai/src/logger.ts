import winston from "winston";

export const defaultNarratorLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(winston.format.cli()),
  transports: [new winston.transports.Console()],
});

export const defaultTrainerLogger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ message }) => message),
  transports: [new winston.transports.Console()],
});
