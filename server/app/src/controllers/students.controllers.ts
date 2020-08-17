import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Delete,
  Put,
} from '@nestjs/common';
import { Connection } from 'typeorm';
import { StudentRepository } from '../repositories/student.repository';
import { IRepository } from '../repositories/repository.interface';
import { StudentDto } from '../dtos/students/student.dto';
import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { IdDto } from '../dtos/id/id.dto';
import { StudentMapper } from '../mappers/student.mapper';
import { Student } from './../models/student.model';
import { Parent } from '../models/parent.model';
import { Group } from '../models/group.model';
import { Consultation } from '../models/consultation.model';
import { ConsultationsByIdsPipe } from '../pipes/consultations-by-ids.pipe';
import { ParentsByIdsPipe } from '../pipes/parents-by-ids.pipe';
import { GroupsByIdsPipe } from '../pipes/groups-by-ids.pipe';

const apiEndpoint = '/students';

@Controller()
export class StudentsController {
  studentRepository: IRepository<Student>;

  constructor(private readonly connection: Connection) {
    this.studentRepository = new StudentRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<StudentDto[]> {
    const students = await this.studentRepository.findAll();
    return students.map(StudentMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idDto: IdDto): Promise<StudentDto> {
    const { id } = idDto;
    const student = await this.ensureStudentExistence(id);
    return StudentMapper.toDto(student);
  }

  @Post(apiEndpoint)
  async create(
    @Body() saveStudentDto: SaveStudentDto,
    @Body('parents', ParentsByIdsPipe) parents: Parent[],
    @Body('groups', GroupsByIdsPipe) groups: Group[],
    @Body('consultations', ConsultationsByIdsPipe)
    consultations: Consultation[],
  ): Promise<StudentDto> {
    const student = StudentMapper.toPersistance(
      saveStudentDto,
      parents,
      groups,
      consultations,
    );
    const res = await this.studentRepository.create(student);
    return StudentMapper.toDto(res);
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idDto: IdDto,
    @Body() saveStudentDto: SaveStudentDto,
    @Body('parents', ParentsByIdsPipe) parents: Parent[],
    @Body('groups', GroupsByIdsPipe) groups: Group[],
    @Body('consultations', ConsultationsByIdsPipe)
    consultations: Consultation[],
  ): Promise<void> {
    const { id } = idDto;
    await this.ensureStudentExistence(id);
    const student = StudentMapper.toPersistance(
      saveStudentDto,
      parents,
      groups,
      consultations,
    );
    return this.studentRepository.update({ ...student, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idDto: IdDto): Promise<void> {
    const { id } = idDto;
    await this.ensureStudentExistence(id);
    return this.studentRepository.delete(id);
  }

  private async ensureStudentExistence(id: string): Promise<Student> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new NotFoundException();
    }
    return student;
  }
}
