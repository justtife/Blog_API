const { createLogger, format, transports } = require("winston");

//Logger output Format for file(error messages)
const logFormat = format.printf(({ level, label, timestamp, ...meta }) => {
  return `${timestamp} ${label} [${level}] : ${JSON.stringify(meta)}`;
});
//Logger output Format for console(info,warn,error messages)
const consoleFormat = format.printf(({ level, label, timestamp, message }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

//Create Logger
const devLogger = createLogger({
  format: format.combine(
    format.label({ label: "Alt-Blog-Logger" }),
    format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] })
  ),
  transports: [
    // Console - Log information
    new transports.Console({ format: consoleFormat }),

    //File - Log error
    new transports.File({
      level: "error",
      filename: "logError/devErr.log",
      format: logFormat,
    }),
  ],
});

module.exports = devLogger;
