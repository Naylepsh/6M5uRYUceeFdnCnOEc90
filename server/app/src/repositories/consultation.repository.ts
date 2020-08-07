import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { Repository, EntityRepository, Connection, Between } from 'typeorm';
import { Consultation } from '../models/consultation.model';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Consultation)
export class ConsultationRepository {
  repository: Repository<Consultation>;
  constructor(connection: Connection) {
    this.repository = connection.getRepository(Consultation);
  }

  async findAll(): Promise<Consultation[]> {
    const consultations = await this.repository.find({
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultations;
  }

  async findAllBetween(
    startDatetime: string,
    endDatetime: string,
  ): Promise<ConsultationDto[]> {
    return this.repository.find({
      where: {
        datetime: Between(startDatetime, endDatetime),
      },
    });
  }

  async findById(id: string): Promise<Consultation> {
    const consultation = await this.repository.findOne({
      where: { id },
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultation;
  }

  async createConsultation(consultation: Consultation): Promise<Consultation> {
    return this.repository.save(consultation);
  }

  async updateConsultation(consultation: Consultation): Promise<void> {
    const { id } = consultation;
    delete consultation.id;
    delete consultation.lecturers;
    delete consultation.students;
    await this.repository.update(id, consultation);
  }

  async deleteConsultation(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
