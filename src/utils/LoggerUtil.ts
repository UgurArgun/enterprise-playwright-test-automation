import winston from "winston";
import fs from "fs";
import path from "path";
import moment from "moment-timezone";

// Resolve logging directory relative to project root (src/logging)
const currentDir = __dirname;
const srcDir = path.resolve(currentDir, "..");
const loggingDir = path.resolve(srcDir, "logging");

// Ensure the logging directory exists at runtime
if (!fs.existsSync(loggingDir)) {
  fs.mkdirSync(loggingDir, { recursive: true });
}

// Set the desired timezone
const timeZone = process.env.LOG_TIMEZONE || "Asia/Kolkata";

// Function to format log entries with timestamp and timezone
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    // Use moment-timezone to format the timestamp string
    winston.format.timestamp({ format: () => moment().tz(timeZone).format() }),
    winston.format.splat(),
    winston.format.simple(),
    customFormat
  ),
  transports: [
    new winston.transports.Console({ level: process.env.CONSOLE_LOG_LEVEL || "debug" }),
    new winston.transports.File({
      filename: path.join(loggingDir, "test_run.log"),
      maxFiles: 5, // Number of rotated log files to retain
      maxsize: 300 * 1024, // 300 KB
      level: "info",
    }),
    new winston.transports.File({
      filename: path.join(loggingDir, "test_error.log"),
      maxFiles: 5,
      maxsize: 10 * 1024, // 10 KB
      level: "error",
    }),
  ],
});

export default logger;
