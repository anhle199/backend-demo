import { OperationArgs, Request, Response } from '@loopback/rest'
import { createLogger, format, transports } from 'winston'
import { ILogger } from './types'

export const WINSTON_FORMATTER = format.combine(
  format.splat(),
  format.align(),
  format.timestamp(),
  format.simple(),
  format.colorize(),
  format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`),
)

export const buildInvocationLogMessage = (
  request: Request,
  args: OperationArgs,
  response: Response,
  result: any,
  startTime: [number, number],
) => {
  const method = request.method.toUpperCase()
  const url = request.url
  const version = request.httpVersion
  const statusCode = response.statusCode
  const endTime = process.hrtime(startTime)
  const processTimeInMs = (endTime[0] * 1000000000 + endTime[1]) / 1000000

  return `"${method} ${url} HTTP/${version} ${statusCode} ${processTimeInMs}ms"\nREQUEST - ${args.join(
    ',',
  )}\nRESPONSE - ${result}`
}

export class WinstonLogger implements ILogger {
  private static WINSTON_LOGGER = createLogger({
    format: WINSTON_FORMATTER,
    exitOnError: false,
    transports: [new transports.Console()],
  })

  error(message: any) {
    WinstonLogger.WINSTON_LOGGER.error(message)
  }

  warn(message: any) {
    WinstonLogger.WINSTON_LOGGER.warn(message)
  }

  info(message: any) {
    WinstonLogger.WINSTON_LOGGER.info(message)
  }

  debug(message: any) {
    WinstonLogger.WINSTON_LOGGER.debug(message)
  }
}
