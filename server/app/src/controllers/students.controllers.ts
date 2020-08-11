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
import { StudentRepository } from '../repositories/student.repository';
import { StudentDto } from '../dtos/students/student.dto';
import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { IdParams } from './id.params';
import { Connection } from 'typeorm';
import { StudentMapper } from '../mappers/student.mapper';
import { Student } from './../models/student.model';
import { ConsultationRepository } from '../repositories/consultation.repository';
import { ParentsByIdsPipe } from '../pipes/parents-by-ids.pipe';
import { Parent } from '../models/parent.model';
import { GroupsByIdsPipe } from '../pipes/groups-by-ids.pipe';
import { Group } from '../models/group.model';

const apiEndpoint = '/students';

@Controller()
export class StudentsController {
  studentRepository: StudentRepository;
  consultationRepository: ConsultationRepository;

  constructor(private readonly connection: Connection) {
    this.studentRepository = new StudentRepository(connection);
    this.consultationRepository = new ConsultationRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<StudentDto[]> {
    const students = await this.studentRepository.findAll();
    return students.map(StudentMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<StudentDto> {
    const { id } = idParams;
    const student = await this.ensureStudentExistence(id);
    return StudentMapper.toDto(student);
  }

  @Post(apiEndpoint)
  async create(
    @Body() saveStudentDto: SaveStudentDto,
    @Body('parents', ParentsByIdsPipe) parents: Parent[],
    @Body('groups', GroupsByIdsPipe) groups: Group[],
  ): Promise<StudentDto> {
    const consultations = await this.consultationRepository.findByIds(
      saveStudentDto.consultations,
    );
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
    @Param() idParams: IdParams,
    @Body() saveStudentDto: SaveStudentDto,
    @Body('parents', ParentsByIdsPipe) parents: Parent[],
    @Body('groups', GroupsByIdsPipe) groups: Group[],
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureStudentExistence(id);
    const consultations = await this.consultationRepository.findByIds(
      saveStudentDto.consultations,
    );
    const student = StudentMapper.toPersistance(
      saveStudentDto,
      parents,
      groups,
      consultations,
    );
    return this.studentRepository.update({ ...student, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
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
