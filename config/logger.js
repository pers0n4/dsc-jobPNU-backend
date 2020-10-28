const { createLogger, config, format, transports } = require("winston");
const morgan = require("morgan");
require("dotenv").config();

const consoleFormat = format.combine(
  process.env.NODE_ENV === "production"
    ? format.uncolorize()
    : format.colorize(),
  format.timestamp({ format: "isoDateTime" }),
  format.printf(
    ({ level, message, timestamp, durationMs }) =>
      `[\x1b[37;2m${timestamp}\x1b[0m][${level}] => ${message}${
        durationMs ? ` \x1b[33m${durationMs} ms\x1b[0m` : ""
      }`
  )
);

const fileFormat = format.combine(
  format.uncolorize(),
  format.timestamp({ format: "isoDateTime" }),
  format.json(),
  format.prettyPrint()
);

// error, warn, info, http, verbose, debug, silly
const logger = createLogger({
  level: "info",
  levels: config.npm.levels,
  format: format.simple(),
  transports: [
    new transports.Console({
      level: "debug",
      format: consoleFormat,
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV === "production" || process.env.FILE_LOGGING) {
  logger.add(
    new transports.File({
      filename: "access.log",
      dirname: "logs",
      level: "info",
      format: fileFormat,
    })
  );
  logger.add(
    new transports.File({
      filename: "error.log",
      dirname: "logs",
      level: "error",
      format: fileFormat,
      handleExceptions: true,
    })
  );
}

// Object.entries(config.npm.colors).map(([level, color]) =>
//   logger.log(level, color)
// );

const stream = {
  write: (message) => {
    logger.log({
      level: "http",
      message: message.trim(),
    });
  },
};

morgan.token("method", (req, res) => {
  const method = req.method;
  const color =
    method === "GET"
      ? 34
      : method === "POST"
      ? 32
      : method === "PUT" || method === "PATCH"
      ? 33
      : method === "DELETE"
      ? 31
      : 0;
  return `\x1b[${color}m${method}\x1b[0m`;
});

morgan.token("status", (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? 31
      : status >= 400
      ? 33
      : status >= 300
      ? 36
      : status >= 200
      ? 32
      : 0;
  return `\x1b[${color}m${status}\x1b[0m`;
});

module.exports = {
  logger,
  morgan: () =>
    // combined: :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
    // common:   :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
    // dev:      :method :url :status :response-time ms - :res[content-length]
    // short:    :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
    // tiny:     :method :url :status :res[content-length] - :response-time ms
    morgan(
      process.env.NODE_ENV === "production"
        ? `:remote-addr - ":method :url HTTP/:http-version" :status :res[content-length] - :response-time ms ":referrer" ":user-agent"`
        : `:remote-addr - ":method \x1b[95m:url\x1b[0m HTTP/:http-version" :status \x1b[35m:res[content-length]\x1b[0m - \x1b[33m:response-time ms\x1b[0m ":referrer" ":user-agent"`,
      { stream }
    ),
};
