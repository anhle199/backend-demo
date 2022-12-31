import { get } from '@loopback/rest'
import { DefaultValuesModel } from '../models/default-values-model.model'

export class DefaultValuesModelController {
  @get('/default-values-model')
  getDefaultValuesModel() {
    const resp = {} as DefaultValuesModel
    return resp
  }
}
