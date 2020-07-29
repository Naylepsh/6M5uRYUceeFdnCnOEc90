import { Injectable } from '@nestjs/common';
import { Lecturer } from '../models/lecturer.model';
import { getConnection } from 'typeorm';
import { CreateLecturerDto } from '../dtos/lecturers/create-lecturer.dto';
import { LecturerMapper } from '../mappers/lecturer.mapper';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { LecturerPseudoPersistance } from './../mappers/lecturer.mapper';

@Injectable()
export class LecturerRepository {
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

  async create(createLecturerDto: CreateLecturerDto): Promise<LecturerDto> {
    const lecturerToSave = LecturerMapper.toPersistance(createLecturerDto);
    const id = await this.insertLecturerFields(lecturerToSave);
    await this.insertLecturerRelation(id, 'groups', createLecturerDto.groups);

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

  private async insertLecturerRelation(
    lecturerId: string,
    relationName: string,
    relationIds: string[],
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .relation(Lecturer, relationName)
      .of(lecturerId)
      .add(relationIds);
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
