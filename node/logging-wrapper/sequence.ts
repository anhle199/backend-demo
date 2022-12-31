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
import _ from 'lodash'
import { getHttpAccessLogger, LoggingWrapper } from './logging-wrapper'
const logger = getHttpAccessLogger('sequence.ts')

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
      const result = await this.invoke(route, args)
      logData.result = result

      this.send(response, result)
    } catch (error) {
      logLevel = 'error'
      logData.error = error

      const statusCode = _.get(error, 'statusCode')
      const status = _.get(error, 'status')

      if (statusCode === 500 || status === 500) {
        // prevent "reject" from sending the standard message for "internal server error"
        // statuscode and status can be undefined
        const internalServerError = {
          error: {
            statusCode,
            message: _.get(error, 'message') ?? 'Internal Server Error',
          },
        }
        this.send(response, internalServerError)
      } else {
        this.reject(context, error)
      }
    }

    logger.logHttpInfo(logLevel, logData)
  }
}
