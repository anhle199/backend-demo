import { createLogger, format, LoggerOptions, transports } from 'winston'
import 'winston-daily-rotate-file'

const uppercasedLogLevel = format(info => {
  info.level = info.level.toUpperCase()
  return info
})

const messageLogFormat = format.printf(info => {
  if (info.label) {
    return `[${info.timestamp}] [${info.level}] [${info.label}] - ${info.message}`
  }
  return `[${info.timestamp}] [${info.level}] - ${info.message}`
})

const defaultLogFormat = format.combine(
  uppercasedLogLevel(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), // add 'timestamp' property to 'info' object
)

const consoleTransport = new transports.Console({
  level: 'debug',
  format: format.combine(defaultLogFormat, format.colorize(), messageLogFormat),
})

const fileTransport = new transports.DailyRotateFile({
  filename: 'app-%DATE%',
  extension: '.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  maxSize: '100m',
  maxFiles: '30d',
  level: 'info',
  format: format.combine(defaultLogFormat, messageLogFormat),
})

const WINSTON_LOGGER_OPTIONS: LoggerOptions = {
  exitOnError: false,
  transports: [consoleTransport, fileTransport],
}

export const getWinstonLogger = (label = '') => {
  const logger = createLogger(WINSTON_LOGGER_OPTIONS)
  logger.defaultMeta = {
    label: label,
  }

  return logger
}
