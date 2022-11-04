import { Provider } from '@loopback/core'
import { ILogger } from '../types'
import { WinstonLogger } from '../winston-logger'

export class LoggerProvider implements Provider<ILogger> {
  value() {
    return new WinstonLogger()
  }
}
