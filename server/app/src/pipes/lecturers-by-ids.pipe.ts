import { Injectable, PipeTransform } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { LecturerRepository } from './../repositories/lecturer.repository';
import { Lecturer } from '../models/lecturer.model';

@Injectable()
export class LecturersByIdsPipe implements PipeTransform<any> {
  lecturerRepository: LecturerRepository;
  constructor() {
    const connection = getConnection();
    this.lecturerRepository = new LecturerRepository(connection);
  }

  async transform(value: string[]): Promise<Lecturer[]> {
    const lecturers = await this.lecturerRepository.findByIds(value);
    return lecturers;
  }
}
