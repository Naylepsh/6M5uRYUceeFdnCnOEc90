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
import { IdParams } from './id.params';
import { ConsultationMapper } from '../mappers/consultation.mapper';
import { Consultation } from '../models/consultation.model';

const apiEndpoint = '/consultations';

@Controller()
export class ConsultationsController {
  constructor(
    private readonly consultationRepository: ConsultationRepository,
  ) {}

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
  async findById(@Param() idParams: IdParams): Promise<ConsultationDto> {
    const consultation = await this.ensureConsultationExistence(idParams.id);
    return ConsultationMapper.toDto(consultation);
  }

  @Post(apiEndpoint)
  async create(
    @Body() createConsultationDto: SaveConsultationDto,
  ): Promise<ConsultationDto> {
    const consultation = ConsultationMapper.toPersistance(
      createConsultationDto,
    );
    const res = await this.consultationRepository.create(consultation);
    return res;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() createConsultationDto: SaveConsultationDto,
  ): Promise<void> {
    await this.ensureConsultationExistence(idParams.id);
    const consultation = ConsultationMapper.toPersistance(
      createConsultationDto,
    );
    return this.consultationRepository.update(consultation);
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    await this.ensureConsultationExistence(idParams.id);
    return this.consultationRepository.delete(idParams.id);
  }

  private async ensureConsultationExistence(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findById(id);
    if (!consultation) {
      throw new NotFoundException();
    }
    return consultation;
  }
}
