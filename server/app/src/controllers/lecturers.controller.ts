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
import { LecturerRepository } from '../repositories/lecturer.repository';
import { IRepository } from '../repositories/repository.interface';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { SaveLecturerDto } from '../dtos/lecturers/save-lecturer.dto';
import { IdDto } from '../dtos/id/id.dto';
import { LecturerMapper } from '../mappers/lecturer.mapper';
import { Lecturer } from '../models/lecturer.model';
import { Group } from '../models/group.model';
import { Consultation } from '../models/consultation.model';
import { ConsultationsByIdsPipe } from '../pipes/consultations-by-ids.pipe';
import { GroupsByIdsPipe } from '../pipes/groups-by-ids.pipe';

const apiEndpoint = '/lecturers';

@Controller()
export class LecturersController {
  lecturerRepository: IRepository<Lecturer>;

  constructor(private readonly connection: Connection) {
    this.lecturerRepository = new LecturerRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(): Promise<LecturerDto[]> {
    const lecturers = await this.lecturerRepository.findAll();
    return lecturers.map(LecturerMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idDto: IdDto): Promise<LecturerDto> {
    const { id } = idDto;
    const lecturer = await this.ensureLecturerExistence(id);
    return LecturerMapper.toDto(lecturer);
  }

  @Post(apiEndpoint)
  async create(
    @Body() saveLecturerDto: SaveLecturerDto,
    @Body('groups', GroupsByIdsPipe) groups: Group[],
    @Body('consultations', ConsultationsByIdsPipe)
    consultations: Consultation[],
  ): Promise<LecturerDto> {
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
    @Param() idDto: IdDto,
    @Body() saveLecturerDto: SaveLecturerDto,
    @Body('groups', GroupsByIdsPipe) groups: Group[],
    @Body('consultations', ConsultationsByIdsPipe)
    consultations: Consultation[],
  ): Promise<void> {
    const { id } = idDto;
    await this.ensureLecturerExistence(id);
    const lecturer = LecturerMapper.toPersistance(
      saveLecturerDto,
      groups,
      consultations,
    );
    return this.lecturerRepository.update({ ...lecturer, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idDto: IdDto): Promise<void> {
    const { id } = idDto;
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
