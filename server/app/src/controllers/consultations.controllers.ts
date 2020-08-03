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
  Query,
} from '@nestjs/common';
import { ConsultationRepository } from '../repositories/consultation.repository';
import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { SaveConsultationDto } from '../dtos/consultations/save-consultation.dto';

const apiEndpoint = '/consultations';

@Controller()
export class ConsultationsController {
  consultationRepository: ConsultationRepository;
  constructor() {
    this.consultationRepository = new ConsultationRepository();
  }

  @Get(apiEndpoint)
  async findAll(
    @Query('between') between: [string, string],
  ): Promise<ConsultationDto[]> {
    // quick temporary solution to 'between' query operator
    let consultations: Promise<ConsultationDto[]>;
    if (!between) {
      consultations = this.consultationRepository.findAll();
    } else {
      consultations = this.consultationRepository.findAllBetween(...between);
    }
    return consultations;
  }

  @Get(`${apiEndpoint}/:id`)
  async findById(@Param('id') id: string): Promise<ConsultationDto> {
    ensureUuidIsValid(id);
    const consultation = await this.ensureConsultationExistence(id);
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
    @Param('id') id: string,
    @Body() createConsultationDto: SaveConsultationDto,
  ): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureConsultationExistence(id);
    return this.consultationRepository.update({ ...createConsultationDto, id });
  }

  @Delete(`${apiEndpoint}/:id`)
  async delete(@Param('id') id: string): Promise<void> {
    ensureUuidIsValid(id);
    await this.ensureConsultationExistence(id);
    return this.consultationRepository.delete(id);
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
