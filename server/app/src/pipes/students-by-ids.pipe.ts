import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { StudentRepository } from './../repositories/student.repository';
import { Student } from '../models/student.model';
import { EntitiesByIdsPipe } from './entities-by-ids.pipe';

@Injectable()
export class StudentsByIdsPipe extends EntitiesByIdsPipe<Student> {
  constructor() {
    const connection = getConnection();
    const studentRepository = new StudentRepository(connection);
    super(studentRepository);
  }
}
