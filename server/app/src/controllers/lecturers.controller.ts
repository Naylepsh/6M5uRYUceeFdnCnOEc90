import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { LecturerRepository } from '../repositories/lecturer.repository';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { CreateLecturerDto } from '../dtos/lecturers/create-lecturer.dto';

const apiEndpoint = '/lecturers';

@Controller()
export class LecturersController {
  lecturerRepository: LecturerRepository;
  constructor() {
    this.lecturerRepository = new LecturerRepository();
  }

  @Get(apiEndpoint)
  async findAll(): Promise<LecturerDto[]> {
    const lecturers = await this.lecturerRepository.findAll();
    return lecturers;
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param('id') id: string): Promise<LecturerDto> {
    const lecturer = await this.lecturerRepository.findById(id);
    if (!lecturer) {
      throw new NotFoundException();
    }
    return lecturer;
  }

  @Post(apiEndpoint)
  async create(
    @Body() createLecturerDto: CreateLecturerDto,
  ): Promise<LecturerDto> {
    const lecturer = await this.lecturerRepository.create(createLecturerDto);
    return lecturer;
  }
}
