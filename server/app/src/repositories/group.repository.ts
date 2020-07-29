import { Injectable } from '@nestjs/common';
import { GroupDto } from '../dtos/groups/group.dto';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';
import { getConnection } from 'typeorm';
import { Group } from '../models/group.model';
import { GroupMapper } from '../mappers/group.mapper';

@Injectable()
export class GroupRepository {
  async findById(id: string): Promise<GroupDto> {
    const group = await getConnection()
      .createQueryBuilder()
      .select('group')
      .from(Group, 'group')
      .where('group.id = :id', { id })
      .getOne();
    return GroupMapper.toDto(group, []);
  }

  async create(groupDto: SaveGroupDto): Promise<GroupDto> {
    const groupToSave = GroupMapper.toPersistance(groupDto);
    const group = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values(groupToSave)
      .execute();

    const id = group.identifiers[0]['id'];
    return this.findById(id);
  }
}
