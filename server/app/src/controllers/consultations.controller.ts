import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ConsultationRepository } from '../repositories/consultation.repository';
import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { SaveConsultationDto } from '../dtos/consultations/save-consultation.dto';
import { IdDto } from '../dtos/id.dto';
import { ConsultationMapper } from '../mappers/consultation.mapper';
import { Consultation } from '../models/consultation.model';
import { Connection } from 'typeorm';
import { LecturersByIdsPipe } from '../pipes/lecturers-by-ids.pipe';
import { Lecturer } from '../models/lecturer.model';
import { StudentsByIdsPipe } from '../pipes/students-by-ids.pipe';
import { Student } from '../models/student.model';

const apiEndpoint = '/consultations';

@Controller()
export class ConsultationsController {
  consultationRepository: ConsultationRepository;

  constructor(private readonly connection: Connection) {
    this.consultationRepository = new ConsultationRepository(connection);
  }

  @Get(apiEndpoint)
  async findAll(
    @Query('between') between: [Date, Date],
  ): Promise<ConsultationDto[]> {
    // quick temporary solution to 'between' query operator
    let consultations: ConsultationDto[];
    if (!between) {
      consultations = await this.consultationRepository.findAll();
    } else {
      const dates = between.map(date => new Date(date).toISOString());
      consultations = await this.consultationRepository.findAllBetween(
        dates[0],
        dates[1],
      );
    }
    return consultations.map(ConsultationMapper.toDto);
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idDto: IdDto): Promise<ConsultationDto> {
    const consultation = await this.ensureConsultationExistence(idDto.id);
    return ConsultationMapper.toDto(consultation);
  }

  @Post(apiEndpoint)
  async create(
    @Body() createConsultationDto: SaveConsultationDto,
    @Body('lecturers', LecturersByIdsPipe)
    lecturers: Lecturer[],
    @Body('students', StudentsByIdsPipe) students: Student[],
  ): Promise<ConsultationDto> {
    const consultation = ConsultationMapper.toPersistance(
      createConsultationDto,
      lecturers,
      students,
    );
    const res = await this.consultationRepository.create(consultation);
    return ConsultationMapper.toDto(res);
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idDto: IdDto,
    @Body() createConsultationDto: SaveConsultationDto,
    @Body('lecturers', LecturersByIdsPipe) lecturers: Lecturer[],
    @Body('students', StudentsByIdsPipe) students: Student[],
  ): Promise<void> {
    await this.ensureConsultationExistence(idDto.id);
    const consultation = ConsultationMapper.toPersistance(
      createConsultationDto,
      lecturers,
      students,
    );
    await this.consultationRepository.update({
      ...consultation,
      id: idDto.id,
    });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idDto: IdDto): Promise<void> {
    await this.ensureConsultationExistence(idDto.id);
    return this.consultationRepository.delete(idDto.id);
  }

  private async ensureConsultationExistence(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findById(id);
    if (!consultation) {
      throw new NotFoundException();
    }
    return consultation;
  }
}
