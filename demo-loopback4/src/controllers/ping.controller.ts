import { inject } from '@loopback/core'
import { Request, RestBindings, get, response, ResponseObject, param, post, requestBody } from '@loopback/rest'
import { LoggingWrapper } from '../logging-wrapper'

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: { type: 'string' },
          date: { type: 'string' },
          url: { type: 'string' },
          headers: {
            type: 'object',
            properties: {
              'Content-Type': { type: 'string' },
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
}

const logger = new LoggingWrapper.Logger('ping.controller.ts')

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/ping')
  @response(200, PING_RESPONSE)
  ping(@param.query.string('name') name: string | undefined): object {
    // Reply with a greeting, the current time, the url, and request headers
    logger.error('Error message')
    logger.warn('Warning message')
    logger.info('Info message')
    logger.debug('Debug message')
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    }
  }

  @get('/ping/{id}')
  @response(200, PING_RESPONSE)
  pingById(@param.path.number('id') id: number, @param.query.string('name') name?: string): object {
    // Reply with a greeting, the current time, the url, and request headers
    logger.error('Error message')
    logger.warn('Warning message')
    logger.info('Info message')
    logger.debug('Debug message')
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    }
  }

  @post('/ping')
  postPing(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
            },
          },
        },
      },
    })
    body: {
      id?: number
      name?: string
    },
    // @requestBody.file() file: Request,
  ): object {
    // try {
    //   JSON.stringify(file)
    // } catch (error) {
    //   logger.info(error)
    // }
    //
    logger.error('Error message')
    logger.warn('Warning message')
    logger.info('Info message')
    logger.debug('Debug message')
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    }
  }
}
