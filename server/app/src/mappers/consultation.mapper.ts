import { Consultation } from '../models/consultation.model';
import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { SaveConsultationDto } from '../dtos/consultations/save-consultation.dto';
import { Repository, getConnection } from 'typeorm';
import { Lecturer } from '../models/lecturer.model';
import { Student } from '../models/student.model';

export class ConsultationMapper {
  static consultationRepository: Repository<Consultation>;

  public static toPersistance(
    createConsultationDto: SaveConsultationDto,
    lecturers: Lecturer[] = [],
    students: Student[] = [],
  ): Consultation {
    this.ensureRepoIsInitialized();

    const { datetime, address, description } = createConsultationDto;
    const obj = {
      datetime,
      address,
      description,
      lecturers,
      students,
    };
    return this.consultationRepository.create(obj);
  }

  public static toDto(consultation: Consultation): ConsultationDto {
    const {
      id,
      datetime,
      address,
      description,
      lecturers,
      students,
    } = consultation;
    return {
      id,
      datetime,
      address,
      description,
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
