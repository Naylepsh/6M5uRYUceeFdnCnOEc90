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

const apiEndpoint = '/students';

@Controller()
export class StudentsController {
  studentRepository: StudentRepository;
  constructor() {
    this.studentRepository = new StudentRepository();
  }

  @Get(apiEndpoint)
  async findAll(): Promise<StudentDto[]> {
    const students = await this.studentRepository.findAll();
    return students;
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<StudentDto> {
    const { id } = idParams;
    const student = await this.ensureStudentExistence(id);
    return student;
  }

  @Post(apiEndpoint)
  async create(@Body() saveStudentDto: SaveStudentDto): Promise<StudentDto> {
    const student = await this.studentRepository.create(saveStudentDto);
    return student;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() createStudentDto: SaveStudentDto,
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureStudentExistence(id);
    return this.studentRepository.update({ ...createStudentDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
    await this.ensureStudentExistence(id);
    return this.studentRepository.delete(id);
  }

  private async ensureStudentExistence(id: string): Promise<StudentDto> {
    const student = await this.studentRepository.findById(id);
    if (!student) {
      throw new NotFoundException();
    }
    return student;
  }
}
