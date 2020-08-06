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
import { LecturerRepository } from '../repositories/lecturer.repository';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { SaveLecturerDto } from '../dtos/lecturers/save-lecturer.dto';
import { IdParams } from './id.params';

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
  async findById(@Param() idParams: IdParams): Promise<LecturerDto> {
    const { id } = idParams;
    const lecturer = await this.ensureLecturerExistence(id);
    return lecturer;
  }

  @Post(apiEndpoint)
  async create(@Body() saveLecturerDto: SaveLecturerDto): Promise<LecturerDto> {
    const lecturer = await this.lecturerRepository.create(saveLecturerDto);
    return lecturer;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() createLecturerDto: SaveLecturerDto,
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureLecturerExistence(id);
    return this.lecturerRepository.update({ ...createLecturerDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
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
