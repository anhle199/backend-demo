import { Entity, model, property } from '@loopback/repository'

@model()
export class ReusableModel extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: number

  @property({
    type: 'string',
    required: true,
  })
  name: string

  @property({
    type: 'string',
    required: true,
  })
  displayName: string

  constructor(data?: Partial<ReusableModel>) {
    super(data)
  }
}

export interface ReusableModelRelations {
  // describe nvigational properties here
}

export type ReusableModelWithRelations = ReusableModel & ReusableModelRelations
