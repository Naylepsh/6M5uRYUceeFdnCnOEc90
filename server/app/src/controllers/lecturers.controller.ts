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
import { LecturerRepository } from '../repositories/lecturer.repository';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { CreateLecturerDto } from '../dtos/lecturers/create-lecturer.dto';
import { UpdateLecturerDto } from '../dtos/lecturers/updatelecturer.dto';

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
    ensureUuidIsValid(id);
    const lecturer = await this.ensureLecturerExistence(id);
    return lecturer;
  }

  @Post(apiEndpoint)
  async create(
    @Body() createLecturerDto: CreateLecturerDto,
  ): Promise<LecturerDto> {
    const lecturer = await this.lecturerRepository.create(createLecturerDto);
    return lecturer;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param('id') id: string,
    @Body() createLecturerDto: CreateLecturerDto,
  ): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureLecturerExistence(id);
    return this.lecturerRepository.update({ ...createLecturerDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param('id') id: string): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureLecturerExistence(id);
    return this.lecturerRepository.delete(id);
  }

  private async ensureLecturerExistence(id: string): Promise<LecturerDto> {
    const lecturer = await this.lecturerRepository.findById(id);
    if (!lecturer) {
      throw new NotFoundException();
    }
    return lecturer;
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
