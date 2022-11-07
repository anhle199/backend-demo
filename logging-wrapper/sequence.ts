import { inject } from '@loopback/core'
import {
  FindRoute,
  InvokeMethod,
  ParseParams,
  Reject,
  RequestContext,
  Send,
  SequenceActions,
  SequenceHandler,
  InvokeMiddleware,
} from '@loopback/rest'
import { getWinstonLogger, LoggingWrapper } from './logging-wrapper'

const logger = LoggingWrapper.getHttpAccessLogger(getWinstonLogger('sequence.ts'))

export class LoggingSequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
  protected invokeMiddleware: InvokeMiddleware = () => false

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    const startTime = process.hrtime()
    const { request, response } = context

    let logLevel: LoggingWrapper.TLogLevel = 'info'
    const logData: LoggingWrapper.THttpAccessLogData = {
      request,
      response,
      args: undefined,
      result: undefined,
      error: undefined,
      startTime,
    }

    try {
      const finished = await this.invokeMiddleware(context)
      if (finished) {
        return
      }

      const route = this.findRoute(request)

      const args = await this.parseParams(request, route)
      logData.args = args

      const result = await this.invoke(route, args)
      logData.result = result

      this.send(response, result)
    } catch (error) {
      logLevel = 'error'
      logData.error = error

      this.reject(context, error)
    }

    logger.logHttpInfo(logLevel, logData)
  }
}
