import { repository } from '@loopback/repository'
import { get, getModelSchemaRef, post, requestBody } from '@loopback/rest'
import { NullableArrayProperty } from '../models/nullable-array-property.model'
import { NullableArrayPropertyRepository } from '../repositories'

export class ModellingController {
  constructor(@repository(NullableArrayPropertyRepository) private repo: NullableArrayPropertyRepository) {}

  @post('/modelling')
  postModelling(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NullableArrayProperty, { exclude: ['id'] }),
        },
      },
    })
    body: Omit<NullableArrayProperty, 'id'>,
  ) {
    console.log('body', body)
    return this.repo.create(body)
  }

  @get('/modelling')
  async getModelling() {
    const data = await this.repo.find()
    console.log('data', data)
    return data
  }
}
