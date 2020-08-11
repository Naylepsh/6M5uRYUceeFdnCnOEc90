import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
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

  async transform(ids: string[]): Promise<Lecturer[]> {
    const lecturers = await this.lecturerRepository.findByIds(ids);
    if (lecturers.length < ids.length) {
      throw new BadRequestException('Some of the given lecturers do not exist');
    }
    return lecturers;
  }
}
