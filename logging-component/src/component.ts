import { injectable, Component, ContextTags, ProviderMap } from '@loopback/core'
import { LoggingComponentBindings } from './keys'
import { LoggerProvider } from './providers/logger.provider'

// Configure the binding for LoggingComponent
@injectable({ tags: { [ContextTags.KEY]: LoggingComponentBindings.COMPONENT } })
export class LoggingComponent implements Component {
  providers: ProviderMap = {
    [LoggingComponentBindings.LOGGER.key]: LoggerProvider,
  }
}
