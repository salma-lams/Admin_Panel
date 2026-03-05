import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

const logDir = "logs";

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);

const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.json()
);

const transports = [
    new winston.transports.Console({ format }),
    new DailyRotateFile({
        filename: path.join(logDir, "error-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        level: "error",
        format: fileFormat,
    }),
    new DailyRotateFile({
        filename: path.join(logDir, "combined-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "14d",
        format: fileFormat,
    }),
];

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    transports,
});
