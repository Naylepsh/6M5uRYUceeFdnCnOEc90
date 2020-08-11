import { Injectable, PipeTransform } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { GroupRepository } from './../repositories/group.repository';
import { Group } from '../models/group.model';

@Injectable()
export class GroupsByIdsPipe implements PipeTransform<any> {
  groupRepository: GroupRepository;

  constructor() {
    const connection = getConnection();
    this.groupRepository = new GroupRepository(connection);
  }

  async transform(ids: string[]): Promise<Group[]> {
    const groups = await this.groupRepository.findByIds(ids);
    return groups;
  }
}
