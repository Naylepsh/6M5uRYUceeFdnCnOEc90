import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { Student } from '../models/student.model';
import { StudentDto } from '../dtos/students/student.dto';
import { Group } from '../models/group.model';
import { GroupMapper } from './group.mapper';

export interface StudentPseudoPersistance {
  id?: string;
  firstName: string;
  lastName: string;
}

export class StudentMapper {
  public static toPersistance(
    saveStudentDto: SaveStudentDto,
  ): StudentPseudoPersistance {
    const { firstName, lastName } = saveStudentDto;
    return {
      firstName,
      lastName,
    };
  }

  public static toDto(student: Student, groups: Group[] = []): StudentDto {
    const { id, firstName, lastName } = student;
    const groupDtos = groups.map(group => GroupMapper.toDto(group));
    return { id, firstName, lastName, groups: groupDtos };
  }
}
