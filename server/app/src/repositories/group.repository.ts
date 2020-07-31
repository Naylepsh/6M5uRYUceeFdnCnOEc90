import { Injectable } from '@nestjs/common';
import { GroupDto } from '../dtos/groups/group.dto';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';
import { getConnection } from 'typeorm';
import { Group } from '../models/group.model';
import { GroupMapper } from '../mappers/group.mapper';
import { GroupPseudoPersistance } from './../mappers/group.mapper';
import { RelationManager } from './helpers/relation';

@Injectable()
export class GroupRepository {
  lecturerRelationManager: RelationManager;
  studentsRelationManager: RelationManager;

  constructor() {
    this.lecturerRelationManager = new RelationManager(Group, 'lecturers');
    this.studentsRelationManager = new RelationManager(Group, 'students');
  }

  async findAll(): Promise<GroupDto[]> {
    const groups = await getConnection()
      .createQueryBuilder()
      .select('group')
      .from(Group, 'group')
      .leftJoinAndSelect('group.lecturers', 'lecturers')
      .leftJoinAndSelect('group.students', 'students')
      .getMany();
    return groups.map(group =>
      GroupMapper.toDto(group, group.lecturers, group.students),
    );
  }

  async findById(id: string): Promise<GroupDto> {
    const group = await getConnection()
      .createQueryBuilder()
      .select('group')
      .from(Group, 'group')
      .where('group.id = :id', { id })
      .leftJoinAndSelect('group.lecturers', 'lecturers')
      .leftJoinAndSelect('group.students', 'students')
      .getOne();
    if (!group) return null;
    return GroupMapper.toDto(group, group.lecturers, group.students);
  }

  async create(groupDto: SaveGroupDto): Promise<GroupDto> {
    const groupToSave = GroupMapper.toPersistance(groupDto);
    const id = await this.insertGroupFields(groupToSave);
    await this.lecturerRelationManager.insertRelation(id, groupDto.lecturers);
    await this.studentsRelationManager.insertRelation(id, groupDto.students);
    return this.findById(id);
  }

  private async insertGroupFields(
    groupToSave: GroupPseudoPersistance,
  ): Promise<string> {
    const group = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Group)
      .values(groupToSave)
      .execute();

    const id = group.identifiers[0]['id'];
    return id;
  }

  async update(groupDto: SaveGroupDto): Promise<void> {
    const id = groupDto.id;
    const groupToSave = GroupMapper.toPersistance(groupDto);
    await this.updateGroupFields(id, groupToSave);
    const group = await this.findById(id);
    const lecturersToRemove = group.lecturers.map(lecturer => lecturer.id);
    await this.lecturerRelationManager.updateRelation(
      id,
      groupDto.lecturers,
      lecturersToRemove,
    );
    const studentsToRemove = group.students.map(student => student.id);
    await this.studentsRelationManager.updateRelation(
      id,
      groupDto.students,
      studentsToRemove,
    );
  }

  private async updateGroupFields(
    id: string,
    groupToSave: GroupPseudoPersistance,
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(Group)
      .set(groupToSave)
      .where('id = :id', { id })
      .execute();
  }

  async delete(id: string): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Group)
      .where('id = :id', { id })
      .execute();
  }
}
