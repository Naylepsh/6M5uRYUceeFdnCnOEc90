import { Injectable } from '@nestjs/common';
import { Lecturer } from '../models/lecturer.model';
import { getConnection } from 'typeorm';
import { SaveLecturerDto } from '../dtos/lecturers/save-lecturer.dto';
import { LecturerMapper } from '../mappers/lecturer.mapper';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { LecturerPseudoPersistance } from './../mappers/lecturer.mapper';
import { RelationManager } from './helpers/relation';

@Injectable()
export class LecturerRepository {
  groupRelationManager: RelationManager;
  constructor() {
    this.groupRelationManager = new RelationManager(Lecturer, 'groups');
  }

  async findAll(): Promise<LecturerDto[]> {
    const lecturers = await getConnection()
      .createQueryBuilder()
      .select('lecturer')
      .from(Lecturer, 'lecturer')
      .leftJoinAndSelect('lecturer.groups', 'groups')
      .getMany();
    return lecturers.map(lecturer =>
      LecturerMapper.toDto(lecturer, lecturer.groups),
    );
  }

  async findById(id: string): Promise<LecturerDto> {
    const lecturer = await getConnection()
      .createQueryBuilder()
      .select('lecturer')
      .from(Lecturer, 'lecturer')
      .where('lecturer.id = :id', { id })
      .leftJoinAndSelect('lecturer.groups', 'groups')
      .getOne();
    if (!lecturer) return null;
    return LecturerMapper.toDto(lecturer, lecturer.groups);
  }

  async create(createLecturerDto: SaveLecturerDto): Promise<LecturerDto> {
    const lecturerToSave = LecturerMapper.toPersistance(createLecturerDto);
    const id = await this.insertLecturerFields(lecturerToSave);
    await this.groupRelationManager.insertRelation(
      id,
      createLecturerDto.groups,
    );

    return this.findById(id);
  }

  private async insertLecturerFields(
    lecturerToSave: LecturerPseudoPersistance,
  ): Promise<string> {
    const lecturer = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Lecturer)
      .values([lecturerToSave])
      .execute();
    const id = lecturer.identifiers[0]['id'];
    return id;
  }

  async update(createLecturerDto: SaveLecturerDto): Promise<void> {
    const id = createLecturerDto.id;
    const lecturerToSave = LecturerMapper.toPersistance(createLecturerDto);
    const lecturer = await this.findById(id);
    const groupsToRemove = lecturer.groups.map(group => group.id);
    await this.updateLecturerFields(id, lecturerToSave);
    await this.groupRelationManager.updateRelation(
      id,
      createLecturerDto.groups,
      groupsToRemove,
    );
  }

  private async updateLecturerFields(
    id: string,
    lecturerToSave: LecturerPseudoPersistance,
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(Lecturer)
      .set(lecturerToSave)
      .where('id = :id', { id })
      .execute();
  }

  async delete(id: string): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Lecturer)
      .where('id = :id', { id })
      .execute();
  }
}
