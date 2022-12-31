import { inject } from '@loopback/core'
import { DefaultCrudRepository } from '@loopback/repository'
import { DbDataSource } from '../datasources'
import { ReusableModel, ReusableModelRelations } from '../models/resusable-model.model'

export class ReusableModelRepository extends DefaultCrudRepository<
  ReusableModel,
  typeof ReusableModel.prototype.id,
  ReusableModelRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(ReusableModel, dataSource)
  }
}
