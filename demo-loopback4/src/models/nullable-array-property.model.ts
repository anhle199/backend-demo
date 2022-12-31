import { Entity, model, property } from '@loopback/repository'

@model()
export class NullableArrayProperty extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number

  @property({
    jsonSchema: {
      type: 'array',
      nullable: true,
      items: { type: 'string' },
    },
    postgresql: {
      nullable: 'YES',
      dataType: 'json',
    },
  })
  values?: string[] | null;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any

  constructor(data?: Partial<NullableArrayProperty>) {
    super(data)
  }
}

export interface NullableArrayPropertyRelations {
  // describe nvigational properties here
}

export type NullableArrayPropertyWithRelations = NullableArrayProperty & NullableArrayPropertyRelations
