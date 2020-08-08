import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { Student } from '../models/student.model';
import { StudentDto } from '../dtos/students/student.dto';
import { Repository, getConnection } from 'typeorm';

export class StudentMapper {
  static studentRepository: Repository<Student>;

  public static toPersistance(saveStudentDto: SaveStudentDto): Student {
    this.ensureRepoIsInitialized();

    const { firstName, lastName } = saveStudentDto;
    const obj = {
      firstName,
      lastName,
    };
    return this.studentRepository.create(obj);
  }

  public static toDto(student: Student): StudentDto {
    const { id, firstName, lastName, groups, parents } = student;
    return { id, firstName, lastName, groups, parents };
  }

  private static ensureRepoIsInitialized() {
    if (!this.studentRepository) {
      this.studentRepository = getConnection().getRepository(Student);
    }
  }
}
