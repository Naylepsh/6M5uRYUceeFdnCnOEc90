import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { Repository, EntityRepository, Connection, Between } from 'typeorm';
import { Consultation } from '../models/consultation.model';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Consultation)
export class ConsultationRepository {
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
    });
  }

  async findById(id: string): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultation;
  }

  async createConsultation(consultation: Consultation): Promise<Consultation> {
    return this.consultationRepository.save(consultation);
  }

  async updateConsultation(consultation: Consultation): Promise<void> {
    const { id } = consultation;
    delete consultation.id;
    delete consultation.lecturers;
    delete consultation.students;
    await this.consultationRepository.update(id, consultation);
  }

  async deleteConsultation(id: string): Promise<void> {
    await this.consultationRepository.delete(id);
  }
}
