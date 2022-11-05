import { BindingKey, Interceptor } from '@loopback/core'

export namespace LoggingBindings {
  /**
   * Binding key for http access logger with winston
   */
  export const WINSTON_HTTP_ACCESS_LOGGER = BindingKey.create<Interceptor>('logging.winston.httpAccessLogger')
}
