import { Provider } from '@loopback/core'
import { createLogger, Logger } from 'winston'
import { WINSTON_LOGGER_OPTIONS } from '../winston-config'
import { HttpAccessLogData, ILogger, LogLevel } from './types'

class WinstonLogger implements ILogger {
  private logger: Logger

  constructor(logger: Logger, label?: string) {
    this.logger = logger

    if (label) {
      this.logger.defaultMeta = {
        label: label,
      }
    }
  }

  setLabel(label: string) {
    this.logger.defaultMeta = {
      label: label,
    }
  }

  private log(level: LogLevel, message: string) {
    this.logger.log(level, message).exceptions.unhandle()
  }

  error(message: string) {
    this.log(LogLevel.ERROR, message)
  }

  warn(message: string) {
    this.log(LogLevel.WARN, message)
  }

  info(message: string) {
    this.log(LogLevel.INFO, message)
  }

  debug(message: string) {
    this.log(LogLevel.DEBUG, message)
  }

  logHttpInfo(level: LogLevel, data: HttpAccessLogData) {
    const { request, response, args, result, error, startTime } = data

    const method = request.method.toUpperCase()
    const url = request.url
    const version = request.httpVersion
    const statusCode = response.statusCode
    const endTime = process.hrtime(startTime)
    const processTimeInMs = (endTime[0] * 1000000000 + endTime[1]) / 1000000

    let stringifiedRequestData = ''
    try {
      stringifiedRequestData = JSON.stringify(args)
    } catch (error) {
      stringifiedRequestData = 'error on parsing to json'
    }

    let stringifiedResponseData = ''
    try {
      stringifiedResponseData = JSON.stringify(result ?? error)
    } catch (error) {
      stringifiedResponseData = 'error on parsing to json'
    }

    this.log(level, `[${method}] ${url} HTTP/${version} ${statusCode} ${processTimeInMs.toFixed(3)}ms`)
    this.log(level, `[REQUEST] ${stringifiedRequestData}`)
    this.log(level, `[RESPONSE] ${stringifiedResponseData}`)
  }
}

export class LoggingProvider implements Provider<ILogger> {
  value() {
    const winstonLogger = createLogger(WINSTON_LOGGER_OPTIONS)
    return new WinstonLogger(winstonLogger)
  }
}
