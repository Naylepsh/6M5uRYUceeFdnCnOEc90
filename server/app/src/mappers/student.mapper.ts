import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { Student } from '../models/student.model';
import { StudentDto } from '../dtos/students/student.dto';
import { Repository, getConnection } from 'typeorm';
import { Group } from '../models/group.model';
import { Parent } from '../models/parent.model';
import { Consultation } from '../models/consultation.model';

export class StudentMapper {
  static studentRepository: Repository<Student>;

  public static toPersistance(
    saveStudentDto: SaveStudentDto,
    parents: Parent[] = [],
    groups: Group[] = [],
    consultations: Consultation[] = [],
  ): Student {
    this.ensureRepoIsInitialized();

    const { firstName, lastName } = saveStudentDto;
    const obj = {
      firstName,
      lastName,
      groups,
      parents,
      consultations,
    };
    return this.studentRepository.create(obj);
  }

  public static toDto(student: Student): StudentDto {
    const { id, firstName, lastName, groups, parents, consultations } = student;
    return { id, firstName, lastName, groups, parents, consultations };
  }

  private static ensureRepoIsInitialized() {
    if (!this.studentRepository) {
      this.studentRepository = getConnection().getRepository(Student);
    }
  }
}
