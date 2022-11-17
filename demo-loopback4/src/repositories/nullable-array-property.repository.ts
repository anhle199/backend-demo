import { inject } from '@loopback/core'
import { DefaultCrudRepository } from '@loopback/repository'
import { DbDataSource } from '../datasources'
import { NullableArrayProperty, NullableArrayPropertyRelations } from '../models'

export class NullableArrayPropertyRepository extends DefaultCrudRepository<
  NullableArrayProperty,
  typeof NullableArrayProperty.prototype.id,
  NullableArrayPropertyRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(NullableArrayProperty, dataSource)
  }
}
