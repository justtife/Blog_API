const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const SlackTransport = require("winston-slack-webhook-transport");
//Logger output Format for file(error messages)
const logFormat = format.printf(({ level, label, timestamp, ...meta }) => {
  return `${timestamp} ${label} [${level}] : ${JSON.stringify(meta)}`;
});
//Logger output Format for console(info,warn,error messages)
const consoleFormat = format.printf(({ level, label, timestamp, message }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

const logger = createLogger({
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.MongoDB({
      level: "error",
      db: process.env.MONGO_URI,
      collection: "serverError",
      format: logFormat,
    }),
    new SlackTransport({
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: "app-error",
      username: "AltBlogError",
      level: "error",
      format: logFormat,
    }),
  ],
  format: format.combine(
    format.label({ label: "Alt-Blog-Logger" }),
    format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
   
  ),
});

module.exports = logger;
