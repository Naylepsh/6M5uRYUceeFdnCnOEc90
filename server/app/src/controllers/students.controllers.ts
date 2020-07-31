import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
  Delete,
  Put,
} from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { StudentDto } from '../dtos/students/student.dto';
import { SaveStudentDto } from '../dtos/students/save-student.dto';

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
  async findById(@Param('id') id: string): Promise<StudentDto> {
    ensureUuidIsValid(id);
    const student = await this.ensureStudentExistence(id);
    return student;
  }

  @Post(apiEndpoint)
  async create(@Body() createStudentDto: SaveStudentDto): Promise<StudentDto> {
    const student = await this.studentRepository.create(createStudentDto);
    return student;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param('id') id: string,
    @Body() createStudentDto: SaveStudentDto,
  ): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureStudentExistence(id);
    return this.studentRepository.update({ ...createStudentDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param('id') id: string): Promise<void> {
    ensureUuidIsValid(id);
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

function ensureUuidIsValid(id: string): string {
  if (!validateUuid(id)) {
    throw new BadRequestException();
  }
  return id;
}

function validateUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const match = id.match(uuidRegex);
  return !!match;
}
