import {BindingKey, CoreBindings} from '@loopback/core';
import {LoggingComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace LoggingComponentBindings {
  export const COMPONENT = BindingKey.create<LoggingComponent>(
    `${CoreBindings.COMPONENTS}.LoggingComponent`,
  );
}
