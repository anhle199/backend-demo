import { BootMixin } from '@loopback/boot'
import { ApplicationConfig } from '@loopback/core'
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer'
import { RepositoryMixin } from '@loopback/repository'
import { RestApplication } from '@loopback/rest'
import { ServiceMixin } from '@loopback/service-proxy'
import path from 'path'
import { LoggingSequence } from './sequence'
import { LoggingProvider, LOGGING_PROVIDER_BINDING } from './providers'

export { ApplicationConfig }

export class DemoLoopback4Application extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options)

    // Set up the custom sequence
    this.sequence(LoggingSequence)

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'))

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    })
    this.component(RestExplorerComponent)

    this.bind(LOGGING_PROVIDER_BINDING).toProvider(LoggingProvider)

    this.projectRoot = __dirname
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }
  }
}
