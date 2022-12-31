import {Entity, model, property, hasMany} from '@loopback/repository';
import {Test} from './test.model';

@model()
export class Student extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  fullName: string;

  @property({
    type: 'number',
  })
  courseId?: number;

  @hasMany(() => Test)
  tests: Test[];

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
