import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import {LoggingComponentBindings} from './keys'
import {DEFAULT_LOGGING_COMPONENT_OPTIONS, LoggingComponentOptions} from './types';

// Configure the binding for LoggingComponent
@injectable({tags: {[ContextTags.KEY]: LoggingComponentBindings.COMPONENT}})
export class LoggingComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: LoggingComponentOptions = DEFAULT_LOGGING_COMPONENT_OPTIONS,
  ) {}
}
