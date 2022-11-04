import { BindingKey, CoreBindings } from '@loopback/core'
import { LoggingComponent } from './component'
import { ILogger } from './types'

/**
 * Binding keys used by this component.
 */
export namespace LoggingComponentBindings {
  export const COMPONENT = BindingKey.create<LoggingComponent>(`${CoreBindings.COMPONENTS}.LoggingComponent`)
  export const LOGGER = BindingKey.create<ILogger>('logging.logger')
}
