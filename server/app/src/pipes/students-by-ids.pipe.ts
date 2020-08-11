import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { StudentRepository } from './../repositories/student.repository';
import { Student } from '../models/student.model';

@Injectable()
export class StudentsByIdsPipe implements PipeTransform<any> {
  studentRepository: StudentRepository;

  constructor() {
    const connection = getConnection();
    this.studentRepository = new StudentRepository(connection);
  }

  async transform(ids: string[]): Promise<Student[]> {
    const students = await this.studentRepository.findByIds(ids);
    if (students.length < ids.length) {
      throw new BadRequestException('Some of the given students do not exist');
    }
    return students;
  }
}
