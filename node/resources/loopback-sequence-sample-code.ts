import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication'
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
  Request,
  InvokeMiddleware,
  Response,
} from '@loopback/rest'

import { LoggerBindings, LoggerFactory, LogService } from '@/services'
import { Authentication } from './constants'

export class ApplicationSequence implements SequenceHandler {
  private logger: LogService

  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true }) protected invokeMiddleware: InvokeMiddleware = () =>
    false

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) protected send: Send,
    @inject(SequenceActions.REJECT) protected reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateFn: AuthenticateFn,
    @inject(LoggerBindings.LOGGER_FACTORY) private loggerFactory: LoggerFactory,
  ) {
    this.logger = this.loggerFactory.getLogger([ApplicationSequence.name])
  }

  async authenticate(request: Request): Promise<void> {
    try {
      const { url = '' } = request
      this.logger.info('[authenticate] Authenticating request | Url: %s', url)
      await this.authenticateFn(request)
    } catch (error) {
      const { code } = error || {}
      switch (code) {
        case AUTHENTICATION_STRATEGY_NOT_FOUND:
        case USER_PROFILE_NOT_FOUND: {
          Object.assign(error, { statusCode: 401 })
          break
        }
        default: {
          this.logger.error('[authenticate] Error while sequence!')
          console.log(error)
          break
        }
      }
      throw error
    }
  }

  async handleOAuth2Request(request: Request, response: Response) {
    const queryParams = request.query as any
    const oAuthRedirect = `${request.baseUrl}/auth/${request.query[Authentication.QUERY_PARAM_PROVIDER]}/redirect`
    if (!queryParams['code'] || request.originalUrl.startsWith(oAuthRedirect)) {
      return
    }

    const params = new URLSearchParams(queryParams)
    const redirectUrl = `${oAuthRedirect}?${params.toString()}`
    response.statusCode = 302
    response.setHeader('Location', redirectUrl)
    response.redirect(redirectUrl)
  }

  async authorize(request: Request): Promise<void> {}

  async handle(context: RequestContext): Promise<void> {
    try {
      const { request, response } = context

      const finished = await this.invokeMiddleware(context)
      if (finished) return

      const route = this.findRoute(request)

      const args = await this.parseParams(request, route)
      this.logger.debug('[handle] Parsing request agrs...!', args)

      if (route.pathParams?.provider) {
        request.query[Authentication.QUERY_PARAM_PROVIDER] = route.pathParams.provider
      }

      await this.authenticate(request)

      this.logger.debug('[handle] Invoking request...!')
      await this.handleOAuth2Request(request, response)

      const result = await this.invoke(route, args)

      this.logger.debug('[handle] Sending response...!')
      this.send(response, result)
    } catch (error) {
      this.logger.error('[handle] Request error! Error: %j', error)
      this.reject(context, error)
    }
  }
}
