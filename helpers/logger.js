const {
  createLogger,
  format,
  transports
} = require('winston');
const Sequelize = require('sequelize');
const cloneDeep = require('lodash/cloneDeep');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

const MINIMUM_LOG_LEVEL = process.env.MINIMUM_LOG_LEVEL || 'silly';
const ELASTIC_INDEX_NAME = process.env.ELASTIC_INDEX_NAME || 'URLshortner';
const ELASTIC_LOG_TYPE = process.env.ELASTIC_LOG_TYPE || 'all';

const winstonTransport = new transports.Console({
  level: MINIMUM_LOG_LEVEL
});

const logger = createLogger({
  levels,
  format: format.json(),
  transports: [winstonTransport]
});
/**
 * it converts all value of key to string dataType
 * @param {*} detail
 */
const valueToString = function (details) {
  let detail = cloneDeep(details);
  if (detail === undefined || detail === null) {
    return detail;
  }
  if (!detail) {
    return '' + detail;
  }
  if (detail instanceof Sequelize.Model) {
    detail = detail.get({
      plain: true
    });
  }
  Object.keys(detail)
    .forEach(k => {
      if (typeof detail[k] === 'object') {
        if (detail[k] instanceof Sequelize.Model) {
          return valueToString(detail[k].get({
            plain: true
          }));
        }
        return valueToString(detail[k]);
      }
      detail[k] = '' + detail[k];
    });
  return detail;
};

module.exports = (level, message, details, ...args) => {
  const logLevel = levels[level] !== undefined && level || MINIMUM_LOG_LEVEL;

  if (levels[logLevel] > levels[MINIMUM_LOG_LEVEL]) {
    return;
  }
  const updatedDetail = valueToString(details);
  const log = {
    message,
    ...updatedDetail
  };

  if (log.index === undefined) {
    log.index = ELASTIC_INDEX_NAME;
  }

  if (log.type === undefined) {
    log.type = ELASTIC_LOG_TYPE;
  }

  log.loggedAt = new Date()
    .toISOString();
  log.loggedAt_ts = new Date()
    .getTime();

  if (args && args.length) {
    log.extra = valueToString(args);
  }

  logger.log.apply(logger, [logLevel].concat(log));
  return;
};