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
import { Connection } from 'typeorm';
import { LecturerMapper } from '../mappers/lecturer.mapper';
import { Lecturer } from '../models/lecturer.model';
import { ConsultationRepository } from '../repositories/consultation.repository';
import { GroupsByIdsPipe } from '../pipes/groups-by-ids.pipe';
import { Group } from '../models/group.model';

const apiEndpoint = '/lecturers';

@Controller()
export class LecturersController {
  lecturerRepository: LecturerRepository;
  consultationRepository: ConsultationRepository;

  constructor(private readonly connection: Connection) {
    this.lecturerRepository = new LecturerRepository(connection);
    this.consultationRepository = new ConsultationRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<LecturerDto[]> {
    const lecturers = await this.lecturerRepository.findAll();
    return lecturers.map(LecturerMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<LecturerDto> {
    const { id } = idParams;
    const lecturer = await this.ensureLecturerExistence(id);
    return LecturerMapper.toDto(lecturer);
  }

  @Post(apiEndpoint)
  async create(
    @Body() saveLecturerDto: SaveLecturerDto,
    @Body('groups', GroupsByIdsPipe) groups: Group[],
  ): Promise<LecturerDto> {
    const consultations = await this.consultationRepository.findByIds(
      saveLecturerDto.consultations,
    );
    const lecturer = LecturerMapper.toPersistance(
      saveLecturerDto,
      groups,
      consultations,
    );
    const res = await this.lecturerRepository.create(lecturer);
    return res;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() saveLecturerDto: SaveLecturerDto,
    @Body('groups', GroupsByIdsPipe) groups: Group[],
  ): Promise<void> {
    const { id } = idParams;
    await this.ensureLecturerExistence(id);
    const consultations = await this.consultationRepository.findByIds(
      saveLecturerDto.consultations,
    );
    const lecturer = LecturerMapper.toPersistance(
      saveLecturerDto,
      groups,
      consultations,
    );
    return this.lecturerRepository.update({ ...lecturer, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    const { id } = idParams;
    await this.ensureLecturerExistence(id);
    return this.lecturerRepository.delete(id);
  }

  private async ensureLecturerExistence(id: string): Promise<Lecturer> {
    const lecturer = await this.lecturerRepository.findById(id);
    if (!lecturer) {
      throw new NotFoundException();
    }
    return lecturer;
  }
}
