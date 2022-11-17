import { Entity, model, property } from '@loopback/repository'
import { get, getModelSchemaRef, param, post, requestBody, response } from '@loopback/rest'

@model()
class NamingConverterModel extends Entity {
  @property({
    type: 'number',
    required: true,
  })
  magicNumber: number
}

export class NamingConverterController {
  @get('naming-converter')
  testOnQueryParams(@param.query.number('magic_number') magicNumber?: number) {
    console.log('magicNumber', magicNumber)
    return magicNumber
  }

  @post('naming-converter')
  @response(200, getModelSchemaRef(NamingConverterModel))
  testOnRequestBody(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NamingConverterModel),
        },
      },
    })
    body: NamingConverterModel,
  ) {
    console.log('body', body)
    return body
  }
}
