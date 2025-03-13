const pino = require("pino");
const pretty = require("pino-pretty");

const logger = pino(
  {
    base: {
      pid: false,
    },
  },
  pretty(),
);

module.exports = { logger };
