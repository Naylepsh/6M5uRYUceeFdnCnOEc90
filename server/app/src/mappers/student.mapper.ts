import { SaveStudentDto } from '../dtos/students/save-student.dto';
import { Student } from '../models/student.model';
import { StudentDto } from '../dtos/students/student.dto';
import { Group } from '../models/group.model';
import { GroupMapper } from './group.mapper';
import { Parent } from '../models/parent.model';
import { ParentMapper } from './parent.mapper';

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

  public static toDto(
    student: Student,
    groups: Group[] = [],
    parents: Parent[] = [],
  ): StudentDto {
    const { id, firstName, lastName } = student;
    const groupDtos = groups.map(group => GroupMapper.toDto(group));
    const parentDtos = parents.map(parent => ParentMapper.toDto(parent));
    return { id, firstName, lastName, groups: groupDtos, parents: parentDtos };
  }
}
