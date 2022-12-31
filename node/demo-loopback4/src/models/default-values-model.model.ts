import { Entity, model, property } from '@loopback/repository'

@model()
export class DefaultValuesModel extends Entity {
  @property({
    type: 'number',
  })
  id?: number

  @property({
    type: 'string',
    required: true,
  })
  name: string = 'abc'

  @property({
    type: 'string',
  })
  displayName?: string

  constructor(data?: Partial<DefaultValuesModel>) {
    super(data)
  }
}
