import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { Repository, EntityRepository, Connection, Between } from 'typeorm';
import { Consultation } from '../models/consultation.model';
import { Injectable } from '@nestjs/common';
import { IRepository } from './repository.interface';

@Injectable()
@EntityRepository(Consultation)
export class ConsultationRepository implements IRepository<Consultation> {
  consultationRepository: Repository<Consultation>;

  constructor(connection: Connection) {
    this.consultationRepository = connection.getRepository(Consultation);
  }

  async findAll(): Promise<Consultation[]> {
    const consultations = await this.consultationRepository.find({
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultations;
  }

  async findAllBetween(
    startDatetime: string,
    endDatetime: string,
  ): Promise<ConsultationDto[]> {
    return this.consultationRepository.find({
      where: {
        datetime: Between(startDatetime, endDatetime),
      },
      relations: ['lecturers', 'students', 'students.parents'],
    });
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
