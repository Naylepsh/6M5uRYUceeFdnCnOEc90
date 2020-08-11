import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ParentRepository } from './../repositories/parent.repository';
import { Parent } from '../models/parent.model';
import { EntitiesByIdsPipe } from './entities-by-ids.pipe';

@Injectable()
export class ParentsByIdsPipe extends EntitiesByIdsPipe<Parent> {
  constructor() {
    const connection = getConnection();
    const parentRepository = new ParentRepository(connection);
    super(parentRepository);
  }
}
