import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { Repository, EntityRepository } from 'typeorm';
import { Consultation } from '../models/consultation.model';
import { IRepository } from './repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(Consultation)
export class ConsultationRepository implements IRepository<Consultation> {
  constructor(
    @InjectRepository(Consultation)
    private readonly repository: Repository<Consultation>,
  ) {}

  async findAll(): Promise<Consultation[]> {
    const consultations = await this.repository.find({
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultations;
    // return consultations.map(consultation =>
    //   ConsultationMapper.toDto(
    //     consultation,
    //     consultation.lecturers,
    //     consultation.students,
    //   ),
    // );
  }

  async findAllBetween(
    startDatetime: string,
    endDatetime: string,
  ): Promise<ConsultationDto[]> {
    // const consultations = await getConnection()
    //   .createQueryBuilder()
    //   .select('consultation')
    //   .from(Consultation, 'consultation')
    //   .where('consultation.datetime BETWEEN :startDatetime AND :endDatetime', {
    //     startDatetime,
    //     endDatetime,
    //   })
    //   .leftJoinAndSelect('consultation.lecturers', 'lecturers')
    //   .leftJoinAndSelect('consultation.students', 'students')
    //   .leftJoinAndSelect('students.parents', 'parents')
    //   .getMany();

    // return consultations;
    return [];
  }

  async findById(id: string): Promise<Consultation> {
    const consultation = await this.repository.findOne({
      where: { id },
      relations: ['lecturers', 'students', 'students.parents'],
    });

    return consultation;
  }

  async create(consultation: Consultation): Promise<Consultation> {
    return this.repository.save(consultation);
  }

  async update(consultation: Consultation): Promise<void> {
    await this.repository.update(consultation.id, consultation);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
