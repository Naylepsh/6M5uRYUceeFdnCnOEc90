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

const apiEndpoint = '/consultations';

@Controller()
export class ConsultationsController {
  consultationRepository: ConsultationRepository;
  constructor() {
    this.consultationRepository = new ConsultationRepository();
  }

  @Get(apiEndpoint)
  async findAll(
    @Query('between') between: [Date, Date],
  ): Promise<ConsultationDto[]> {
    // quick temporary solution to 'between' query operator
    let consultations: Promise<ConsultationDto[]>;
    if (!between) {
      consultations = this.consultationRepository.findAll();
    } else {
      const dates = between.map(date => new Date(date).toISOString());
      consultations = this.consultationRepository.findAllBetween(
        dates[0],
        dates[1],
      );
    }
    return consultations;
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param() idParams: IdParams): Promise<ConsultationDto> {
    const consultation = await this.ensureConsultationExistence(idParams.id);
    return consultation;
  }

  @Post(apiEndpoint)
  async create(
    @Body() createConsultationDto: SaveConsultationDto,
  ): Promise<ConsultationDto> {
    const consultation = await this.consultationRepository.create(
      createConsultationDto,
    );
    return consultation;
  }

  @Put(`${apiEndpoint}/:id`)
  async update(
    @Param() idParams: IdParams,
    @Body() createConsultationDto: SaveConsultationDto,
  ): Promise<void> {
    await this.ensureConsultationExistence(idParams.id);
    return this.consultationRepository.update({
      ...createConsultationDto,
      id: idParams.id,
    });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param() idParams: IdParams): Promise<void> {
    await this.ensureConsultationExistence(idParams.id);
    return this.consultationRepository.delete(idParams.id);
  }

  private async ensureConsultationExistence(
    id: string,
  ): Promise<ConsultationDto> {
    const consultation = await this.consultationRepository.findById(id);
    if (!consultation) {
      throw new NotFoundException();
    }
    return consultation;
  }
}
