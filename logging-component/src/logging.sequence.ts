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
import { LoggingComponentBindings } from './keys'
import { ILogger } from './types'
import { buildInvocationLogMessage } from './winston-logger'

export class ApplicationSequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true })
  protected invokeMiddleware: InvokeMiddleware = () => false

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    // @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(LoggingComponentBindings.LOGGER) protected logger: ILogger,
  ) {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const startTime = process.hrtime()
      const { request, response } = context

      const finished = await this.invokeMiddleware(context)
      if (finished) {
        return
      }

      const route = this.findRoute(request)
      const args = await this.parseParams(request, route)
      // await this.authenticateRequest(request)
      const result = await this.invoke(route, args)
      this.send(response, result)

      const invocationLogMessage = buildInvocationLogMessage(request, args, response, result, startTime)
      this.logger.info(invocationLogMessage)
    } catch (error) {
      this.reject(context, error)
    }
  }
}
