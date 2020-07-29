import { SaveLecturerDto } from '../dtos/lecturers/create-lecturer.dto';
import { Lecturer } from '../models/lecturer.model';
import { LecturerDto } from '../dtos/lecturers/lecturer.dto';
import { Group } from '../models/group.model';
import { GroupMapper } from './group.mapper';

export interface LecturerPseudoPersistance {
  id?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export class LecturerMapper {
  public static toPersistance(
    createLecturerDto: SaveLecturerDto,
  ): LecturerPseudoPersistance {
    const { firstName, lastName, phoneNumber, email } = createLecturerDto;
    return {
      firstName,
      lastName,
      phoneNumber,
      email,
    };
  }

  public static toDto(lecturer: Lecturer, groups: Group[]): LecturerDto {
    const { id, firstName, lastName, phoneNumber, email } = lecturer;
    const lecturers = [];
    const groupDtos = groups.map(group => GroupMapper.toDto(group, lecturers));
    return { id, firstName, lastName, phoneNumber, email, groups: groupDtos };
  }
}
