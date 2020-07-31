import { Injectable } from '@nestjs/common';
import { Student } from '../models/student.model';
import { getConnection } from 'typeorm';
import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { StudentMapper } from '../mappers/student.mapper';
import { StudentDto } from '../dtos/students/student.dto';
import { StudentPseudoPersistance } from './../mappers/student.mapper';
import { RelationManager } from './helpers/relation';

@Injectable()
export class StudentRepository {
  groupRelationManager: RelationManager;
  parentRelationManager: RelationManager;

  constructor() {
    this.groupRelationManager = new RelationManager(Student, 'groups');
    this.parentRelationManager = new RelationManager(Student, 'parents');
  }

  async findAll(): Promise<StudentDto[]> {
    const students = await getConnection()
      .createQueryBuilder()
      .select('student')
      .from(Student, 'student')
      .leftJoinAndSelect('student.groups', 'groups')
      .leftJoinAndSelect('student.parents', 'parents')
      .getMany();
    return students.map(student =>
      StudentMapper.toDto(student, student.groups, student.parents),
    );
  }

  async findById(id: string): Promise<StudentDto> {
    const student = await getConnection()
      .createQueryBuilder()
      .select('student')
      .from(Student, 'student')
      .where('student.id = :id', { id })
      .leftJoinAndSelect('student.groups', 'groups')
      .leftJoinAndSelect('student.parents', 'parents')
      .getOne();
    if (!student) return null;
    return StudentMapper.toDto(student, student.groups, student.parents);
  }

  async create(createStudentDto: SaveStudentDto): Promise<StudentDto> {
    const studentToSave = StudentMapper.toPersistance(createStudentDto);
    const id = await this.insertStudentFields(studentToSave);
    await this.groupRelationManager.insertRelation(id, createStudentDto.groups);
    await this.parentRelationManager.insertRelation(
      id,
      createStudentDto.parents,
    );

    return this.findById(id);
  }

  private async insertStudentFields(
    studentToSave: StudentPseudoPersistance,
  ): Promise<string> {
    const student = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Student)
      .values([studentToSave])
      .execute();
    const id = student.identifiers[0]['id'];
    return id;
  }

  async update(createStudentDto: SaveStudentDto): Promise<void> {
    const id = createStudentDto.id;
    const studentToSave = StudentMapper.toPersistance(createStudentDto);
    const student = await this.findById(id);
    await this.updateStudentFields(id, studentToSave);
    const groupsToRemove = student.groups.map(group => group.id);
    await this.groupRelationManager.updateRelation(
      id,
      createStudentDto.groups,
      groupsToRemove,
    );
    const parentsToRemove = student.parents.map(parent => parent.id);
    await this.parentRelationManager.updateRelation(
      id,
      createStudentDto.parents,
      parentsToRemove,
    );
  }

  private async updateStudentFields(
    id: string,
    studentToSave: StudentPseudoPersistance,
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(Student)
      .set(studentToSave)
      .where('id = :id', { id })
      .execute();
  }

  async delete(id: string): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Student)
      .where('id = :id', { id })
      .execute();
  }
}
