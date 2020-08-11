import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ConsultationRepository } from './../repositories/consultation.repository';
import { Consultation } from '../models/consultation.model';
import { EntitiesByIdsPipe } from './entities-by-ids.pipe';

@Injectable()
export class ConsultationsByIdsPipe extends EntitiesByIdsPipe<Consultation> {
  constructor() {
    const connection = getConnection();
    const consultationRepository = new ConsultationRepository(connection);
    super(consultationRepository);
  }
}
