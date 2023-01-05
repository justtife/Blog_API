const devLogger = require("./devLogger");
const prodLogger = require("./prodLogger");

let logger;
if (process.env.NODE_ENV === "development") {
  logger = devLogger;
} else {
  logger = prodLogger;
}

module.exports = logger;
