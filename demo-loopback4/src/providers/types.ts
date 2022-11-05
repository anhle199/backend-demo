import { OperationArgs, Request, Response } from '@loopback/rest'

export type HttpAccessLogData = {
  request: Request
  response: Response
  args: OperationArgs | undefined
  result: boolean | string | number | object | undefined
  error: object | Error | undefined
  startTime: [number, number]
}

interface ILeveledLogMethod {
  (message: string): void
}

// winston log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface IHttpAccessLogMethod {
  (level: LogLevel, data: HttpAccessLogData): void
}

export interface ILogger {
  setLabel(label: string): void
  error: ILeveledLogMethod
  warn: ILeveledLogMethod
  info: ILeveledLogMethod
  debug: ILeveledLogMethod
  logHttpInfo: IHttpAccessLogMethod
}
