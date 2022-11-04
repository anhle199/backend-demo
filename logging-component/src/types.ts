import { OperationArgs, Request } from '@loopback/rest'
import { LogLevel } from './constants'

interface IStandardLogMethod {
  (message: string, ...meta: any[]): void
  (message: any): void
}

interface IHttpLogMethod {
  (level: LogLevel, request: Request, args: OperationArgs, responseData: any): void
}

export interface ILogger {
  error: IStandardLogMethod
  warn: IStandardLogMethod
  info: IStandardLogMethod
  debug: IStandardLogMethod
}
