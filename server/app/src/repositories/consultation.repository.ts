import { Repository, EntityRepository, Connection } from 'typeorm';
import { Consultation } from '../models/consultation.model';
import { Injectable } from '@nestjs/common';
import { IRepository } from './repository.interface';
import { IQuery } from './query.interface';

@Injectable()
@EntityRepository(Consultation)
export class ConsultationRepository implements IRepository<Consultation> {
  consultationRepository: Repository<Consultation>;

  constructor(connection: Connection) {
    this.consultationRepository = connection.getRepository(Consultation);
  }

  async findAll(query?: IQuery): Promise<Consultation[]> {
    const consultations = await this.consultationRepository.find({
      ...query,
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultations;
  }

  async findById(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultation;
  }

  async findByIds(ids: string[]): Promise<Consultation[]> {
    if (ids.length == 0) return [];
    const consultations = await this.consultationRepository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getMany();
    return consultations;
  }

  async create(consultation: Consultation): Promise<Consultation> {
    return this.consultationRepository.save(consultation);
  }

  async update(consultation: Consultation): Promise<void> {
    await this.consultationRepository.save(consultation);
  }

  async delete(id: string): Promise<void> {
    await this.consultationRepository.delete(id);
  }
}
