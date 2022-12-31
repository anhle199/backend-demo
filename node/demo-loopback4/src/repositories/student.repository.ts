import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Student, StudentRelations, Test} from '../models';
import {TestRepository} from './test.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.id,
  StudentRelations
> {

  public readonly tests: HasManyRepositoryFactory<Test, typeof Student.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TestRepository') protected testRepositoryGetter: Getter<TestRepository>,
  ) {
    super(Student, dataSource);
    this.tests = this.createHasManyRepositoryFactoryFor('tests', testRepositoryGetter,);
    this.registerInclusionResolver('tests', this.tests.inclusionResolver);
  }
}
