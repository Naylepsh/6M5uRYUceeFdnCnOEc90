import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { GroupRepository } from './../repositories/group.repository';
import { Group } from '../models/group.model';
import { EntitiesByIdsPipe } from './entities-by-ids.pipe';

@Injectable()
export class GroupsByIdsPipe extends EntitiesByIdsPipe<Group> {
  constructor() {
    const connection = getConnection();
    const groupRepository = new GroupRepository(connection);
    super(groupRepository);
  }
}
