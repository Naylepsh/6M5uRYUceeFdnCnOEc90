import { CreateLecturerDto } from '../dtos/lecturers/create-lecturer.dto';
import { Lecturer } from '../models/lecturer.model';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { Group } from '../models/group.model';
import { GroupMapper } from './group.mapper';

interface LecturerPseudoPersistance {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  groups: { id: string }[];
}

export class LecturerMapper {
  public static toPersistance(
    createLecturerDto: CreateLecturerDto,
  ): LecturerPseudoPersistance {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      groups,
    } = createLecturerDto;
    return {
      firstName,
      lastName,
      phoneNumber,
      email,
      groups: groups.map(id => ({ id })),
    };
  }

  public static toDto(lecturer: Lecturer, groups: Group[]): LecturerDto {
    const { id, firstName, lastName, phoneNumber, email } = lecturer;
    const lecturers = [];
    const groupDtos = groups.map(group => GroupMapper.toDto(group, lecturers));
    return { id, firstName, lastName, phoneNumber, email, groups: groupDtos };
  }
}
