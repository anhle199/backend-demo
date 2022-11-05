import { BindingKey } from '@loopback/core'
import { ILogger } from './types'

export const LOGGING_PROVIDER_BINDING = BindingKey.create<ILogger>('providers.LoggingProvider')
