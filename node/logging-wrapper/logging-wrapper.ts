import { OperationArgs, Request, Response } from '@loopback/rest'
import _ from 'lodash'
import { getWinstonLogger } from './winston-config'

export const getLogger = (label = '') => {
  return new LoggingWrapper.Logger(getWinstonLogger(label))
}

export const getHttpAccessLogger = (label = '') => {
  return new LoggingWrapper.HttpAccessLogger(getWinstonLogger(label))
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoggingWrapper {
  // Types
  export type TLogLevel = 'error' | 'warn' | 'info' | 'debug'
  export type TMessage = string | number | boolean | undefined | null | object | Error
  export type TResponseData = string | number | boolean | undefined | null | object
  export type THttpAccessLogData = {
    request: Request
    response: Response
    result: TResponseData
    error: object | Error | undefined
    startTime: [number, number]
  }

  // Interfaces
  export interface ILogger {
    log(level: TLogLevel, message: string): void
  }

  // Implementation classes
  export class Logger {
    protected logger: ILogger

    constructor(logger: ILogger) {
      this.logger = logger
    }

    protected log(level: TLogLevel, ...messages: TMessage[]) {
      const formattedMessages = messages.map(msg => {
        if (msg instanceof Error) {
          return JSON.stringify({ message: msg.message, stack: msg.stack })
        } else if (typeof msg === 'object') {
          return JSON.stringify(msg)
        }

        return msg
      })

      this.logger.log(level, formattedMessages.join(' '))
    }

    error(...messages: TMessage[]) {
      this.log('error', ...messages)
    }

    warn(...messages: TMessage[]) {
      this.log('warn', ...messages)
    }

    info(...messages: TMessage[]) {
      this.log('info', ...messages)
    }

    debug(...messages: TMessage[]) {
      this.log('debug', ...messages)
    }
  }

  export class HttpAccessLogger extends Logger {
    logHttpInfo(level: TLogLevel, data: THttpAccessLogData) {
      const { request, response, result, error, startTime } = data

      const method = request.method.toUpperCase()
      const url = request.url
      const version = request.httpVersion
      const statusCode = response.statusCode
      const endTime = process.hrtime(startTime)
      const processTimeInMs = (endTime[0] * 1000000000 + endTime[1]) / 1000000

      const stringifiedQuery = this.stringifyRequestResponseData(request.query)
      const stringifiedParams = this.stringifyRequestResponseData(request.body)
      let stringifiedResponseData: string | undefined = ''

      // cannot stringify to string
      if (error && error instanceof Error) {
        stringifiedResponseData = JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: _.get(error, 'code'), // possible undefined, only available on HttpErrors
          details: _.get(error, 'details'), // possible undefined, only available on HttpErrors
        })
      } else {
        // omit url: **/explorer/.....      OpenAPI explorer
        if (request.originalUrl.startsWith('/explorer/')) {
          stringifiedResponseData = '[omitted]'
        } else {
          stringifiedResponseData = this.stringifyRequestResponseData(result)
        }
      }

      this.log(level, `[${method}] ${url} HTTP/${version} ${statusCode} ${processTimeInMs.toFixed(3)}ms`)
      this.log(level, `[REQUEST]`, { query: stringifiedQuery }, { body: stringifiedParams })
      this.log(level, `[RESPONSE] ${stringifiedResponseData}`)
    }

    private stringifyRequestResponseData(data: OperationArgs | TResponseData): string | undefined {
      let stringifiedData = ''
      try {
        stringifiedData = JSON.stringify(data) // string or undefined
      } catch (err) {
        stringifiedData = '[error on stringifying]'
      }

      return stringifiedData
    }
  }
}
