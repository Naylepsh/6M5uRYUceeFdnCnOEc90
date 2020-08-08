import { Consultation } from '../models/consultation.model';
import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { SaveConsultationDto } from '../dtos/consultations/save-consultation.dto';
import { Repository, getConnection } from 'typeorm';
import { Lecturer } from '../models/lecturer.model';

export class ConsultationMapper {
  static consultationRepository: Repository<Consultation>;

  public static toPersistance(
    createConsultationDto: SaveConsultationDto,
    lecturers: Lecturer[] = [],
  ): Consultation {
    this.ensureRepoIsInitialized();

    const { datetime, address, room } = createConsultationDto;
    const obj = {
      datetime,
      address,
      room,
      lecturers,
    };
    if (!lecturers) {
      delete obj.lecturers;
    }
    return this.consultationRepository.create(obj);
  }

  public static toDto(consultation: Consultation): ConsultationDto {
    const { id, datetime, address, room, lecturers, students } = consultation;
    return {
      id,
      datetime,
      address,
      room,
      lecturers,
      students,
    };
  }

  private static ensureRepoIsInitialized() {
    if (!this.consultationRepository) {
      this.consultationRepository = getConnection().getRepository(Consultation);
    }
  }
}
