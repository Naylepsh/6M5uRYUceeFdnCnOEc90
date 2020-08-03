import { Injectable } from '@nestjs/common';
import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { SaveConsultationDto } from '../dtos/consultations/save-consultation.dto';
import { getConnection } from 'typeorm';
import { Consultation } from '../models/consultation.model';
import { ConsultationMapper } from '../mappers/consultation.mapper';
import { ConsultationPseudoPersistance } from './../mappers/consultation.mapper';
import { RelationManager } from './helpers/relation';

@Injectable()
export class ConsultationRepository {
  lecturerRelationManager: RelationManager;
  studentsRelationManager: RelationManager;

  constructor() {
    this.lecturerRelationManager = new RelationManager(
      Consultation,
      'lecturers',
    );
    this.studentsRelationManager = new RelationManager(
      Consultation,
      'students',
    );
  }

  async findAll(): Promise<ConsultationDto[]> {
    const consultations = await getConnection()
      .createQueryBuilder()
      .select('consultation')
      .from(Consultation, 'consultation')
      .leftJoinAndSelect('consultation.lecturers', 'lecturers')
      .leftJoinAndSelect('consultation.students', 'students')
      .leftJoinAndSelect('students.parents', 'parents')
      .getMany();
    return consultations.map(consultation =>
      ConsultationMapper.toDto(
        consultation,
        consultation.lecturers,
        consultation.students,
      ),
    );
  }

  async findAllBetween(
    startDatetime: string,
    endDatetime: string,
  ): Promise<ConsultationDto[]> {
    const consultations = await getConnection()
      .createQueryBuilder()
      .select('consultation')
      .from(Consultation, 'consultation')
      .where('consultation.datetime BETWEEN :startDatetime AND :endDatetime', {
        startDatetime,
        endDatetime,
      })
      .leftJoinAndSelect('consultation.lecturers', 'lecturers')
      .leftJoinAndSelect('consultation.students', 'students')
      .leftJoinAndSelect('students.parents', 'parents')
      .getMany();
    return consultations.map(consultation =>
      ConsultationMapper.toDto(
        consultation,
        consultation.lecturers,
        consultation.students,
      ),
    );
  }

  async findById(id: string): Promise<ConsultationDto> {
    const consultation = await getConnection()
      .createQueryBuilder()
      .select('consultation')
      .from(Consultation, 'consultation')
      .where('consultation.id = :id', { id })
      .leftJoinAndSelect('consultation.lecturers', 'lecturers')
      .leftJoinAndSelect('consultation.students', 'students')
      .leftJoinAndSelect('students.parents', 'parents')
      .getOne();
    if (!consultation) return null;
    return ConsultationMapper.toDto(
      consultation,
      consultation.lecturers,
      consultation.students,
    );
  }

  async create(consultationDto: SaveConsultationDto): Promise<ConsultationDto> {
    const consultationToSave = ConsultationMapper.toPersistance(
      consultationDto,
    );
    const id = await this.insertConsultationFields(consultationToSave);
    await this.lecturerRelationManager.insertRelation(
      id,
      consultationDto.lecturers,
    );
    await this.studentsRelationManager.insertRelation(
      id,
      consultationDto.students,
    );
    return this.findById(id);
  }

  private async insertConsultationFields(
    consultationToSave: ConsultationPseudoPersistance,
  ): Promise<string> {
    const consultation = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Consultation)
      .values(consultationToSave)
      .execute();

    const id = consultation.identifiers[0]['id'];
    return id;
  }

  async update(consultationDto: SaveConsultationDto): Promise<void> {
    const id = consultationDto.id;
    const consultationToSave = ConsultationMapper.toPersistance(
      consultationDto,
    );
    await this.updateConsultationFields(id, consultationToSave);
    const consultation = await this.findById(id);
    const lecturersToRemove = consultation.lecturers.map(
      lecturer => lecturer.id,
    );
    await this.lecturerRelationManager.updateRelation(
      id,
      consultationDto.lecturers,
      lecturersToRemove,
    );
    const studentsToRemove = consultation.students.map(student => student.id);
    await this.studentsRelationManager.updateRelation(
      id,
      consultationDto.students,
      studentsToRemove,
    );
  }

  private async updateConsultationFields(
    id: string,
    consultationToSave: ConsultationPseudoPersistance,
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(Consultation)
      .set(consultationToSave)
      .where('id = :id', { id })
      .execute();
  }

  async delete(id: string): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Consultation)
      .where('id = :id', { id })
      .execute();
  }
}
