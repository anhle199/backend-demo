import { createLogger } from 'winston'
import { OperationArgs, Request, Response } from '@loopback/rest'
import { WINSTON_LOGGER_OPTIONS } from './winston-config'
import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LoggingWrapper {
  export type TLogLevel = 'error' | 'warn' | 'info' | 'debug'
  type TMessage = string | number | boolean | undefined | null | object | Error
  type TResponseData = string | number | boolean | undefined | null | object
  export type THttpAccessLogData = {
    request: Request
    response: Response
    args: OperationArgs | undefined
    result: TResponseData
    error: object | Error | undefined
    startTime: [number, number]
  }

  export class Logger {
    private logger = createLogger(WINSTON_LOGGER_OPTIONS)

    constructor(label?: string) {
      this.setLabel(label ?? '')
    }

    setLabel(label: string) {
      this.logger.defaultMeta = {
        label: label,
      }
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
      this.log('error', messages)
    }

    warn(...messages: TMessage[]) {
      this.log('warn', messages)
    }

    info(...messages: TMessage[]) {
      this.log('info', messages)
    }

    debug(...messages: TMessage[]) {
      this.log('debug', messages)
    }
  }

  export class HttpAccessLogger extends Logger {
    logHttpInfo(level: TLogLevel, data: THttpAccessLogData) {
      const { request, response, args, result, error, startTime } = data

      const method = request.method.toUpperCase()
      const url = request.url
      const version = request.httpVersion
      const statusCode = response.statusCode
      const endTime = process.hrtime(startTime)
      const processTimeInMs = (endTime[0] * 1000000000 + endTime[1]) / 1000000

      const stringifiedRequestData = stringifyRequestResponseData(args)
      let stringifiedResponseData = ''

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
        stringifiedResponseData = stringifyRequestResponseData(result)
      }

      this.log(level, `[${method}] ${url} HTTP/${version} ${statusCode} ${processTimeInMs.toFixed(3)}ms`)
      this.log(level, `[REQUEST] ${stringifiedRequestData}`)
      this.log(level, `[RESPONSE] ${stringifiedResponseData}`)
    }
  }

  const stringifyRequestResponseData = (data: OperationArgs | TResponseData) => {
    let stringifiedData = ''
    try {
      stringifiedData = JSON.stringify(data)
    } catch (err) {
      stringifiedData = '[error on stringifying]'
    }

    return stringifiedData
  }
}
