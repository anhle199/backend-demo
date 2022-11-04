# logging-component

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install LoggingComponent using `npm`;

```sh
$ [npm install | yarn add] logging-component
```

## Basic Use

Configure and load LoggingComponent in the application constructor
as shown below.

```ts
import {LoggingComponent, LoggingComponentOptions, DEFAULT_LOGGING_COMPONENT_OPTIONS} from 'logging-component';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: LoggingComponentOptions = DEFAULT_LOGGING_COMPONENT_OPTIONS;
    this.configure(LoggingComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(LoggingComponent);
    // ...
  }
  // ...
}
```
