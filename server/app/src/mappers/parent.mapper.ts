import { SaveParentDto } from '../dtos/parents/save-parent.dto';
import { Parent } from '../models/parent.model';
import { ParentDto } from '../dtos/parents/parent.dto';
import { Student } from '../models/student.model';
import { StudentMapper } from './student.mapper';

export interface ParentPseudoPersistance {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export class ParentMapper {
  public static toPersistance(
    saveParentDto: SaveParentDto,
  ): ParentPseudoPersistance {
    const { firstName, lastName, phoneNumber, email } = saveParentDto;
    return {
      firstName,
      lastName,
      phoneNumber,
      email,
    };
  }

  public static toDto(parent: Parent, children: Student[] = []): ParentDto {
    const { id, firstName, lastName, phoneNumber, email } = parent;
    const childDtos = children.map(child => StudentMapper.toDto(child));
    return { id, firstName, lastName, phoneNumber, email, children: childDtos };
  }
}
