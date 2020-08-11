import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { LecturerRepository } from './../repositories/lecturer.repository';
import { Lecturer } from '../models/lecturer.model';
import { EntitiesByIdsPipe } from './entities-by-ids.pipe';

@Injectable()
export class LecturersByIdsPipe extends EntitiesByIdsPipe<Lecturer> {
  constructor() {
    const connection = getConnection();
    const lecturerRepository = new LecturerRepository(connection);
    super(lecturerRepository);
  }
}
