import { SaveLecturerDto } from '../dtos/lecturers/save-lecturer.dto';
import { Lecturer } from '../models/lecturer.model';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { Repository, getConnection } from 'typeorm';
import { Group } from '../models/group.model';
import { Consultation } from '../models/consultation.model';

export class LecturerMapper {
  private static lecturerRepository: Repository<Lecturer>;

  public static toPersistance(
    createLecturerDto: SaveLecturerDto,
    groups: Group[],
    consultations: Consultation[],
  ): Lecturer {
    this.ensureRepoIsInitialized();

    const { firstName, lastName, phoneNumber, email } = createLecturerDto;
    const obj = {
      firstName,
      lastName,
      phoneNumber,
      email,
      groups,
      consultations,
    };
    return this.lecturerRepository.create(obj);
  }

  public static toDto(lecturer: Lecturer): LecturerDto {
    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      groups,
      consultations,
    } = lecturer;
    return {
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      groups,
      consultations,
    };
  }

  private static ensureRepoIsInitialized() {
    if (!this.lecturerRepository) {
      this.lecturerRepository = getConnection().getRepository(Lecturer);
    }
  }
}
