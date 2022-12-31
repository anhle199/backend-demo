import { Filter, ModelType, repository } from '@loopback/repository'
import { get, getModelSchemaRef, param, post, requestBody } from '@loopback/rest'
import { ReusableModel } from '../models/resusable-model.model'
import { ReusableModelRepository } from '../repositories/reusable-model.repository'

export class ReusableModelController {
  constructor(@repository(ReusableModelRepository) private repo: ReusableModelRepository) {}

  @get('/reusable-model')
  getReusableModels(@param.filter(ReusableModel) filter?: Filter<ReusableModel>) {
    return this.repo.find(filter)
  }

  @post('/reusable-model')
  postReusableModel(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ReusableModel, { exclude: ['id'] }),
        },
      },
    })
    body: Omit<ReusableModel, 'id'>,
  ) {
    return this.repo.create(body)
  }
}
