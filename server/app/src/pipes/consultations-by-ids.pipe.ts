import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ConsultationRepository } from './../repositories/consultation.repository';
import { Consultation } from '../models/consultation.model';

@Injectable()
export class ConsultationsByIdsPipe implements PipeTransform<any> {
  consultationRepository: ConsultationRepository;

  constructor() {
    const connection = getConnection();
    this.consultationRepository = new ConsultationRepository(connection);
  }

  async transform(ids: string[]): Promise<Consultation[]> {
    const consultations = await this.consultationRepository.findByIds(ids);
    if (consultations.length < ids.length) {
      throw new BadRequestException(
        'Some of the given consultations do not exist',
      );
    }
    return consultations;
  }
}
