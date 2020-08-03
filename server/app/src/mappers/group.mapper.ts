import { Group } from '../models/group.model';
import { Lecturer } from '../models/lecturer.model';
import { GroupDto } from '../dtos/groups/group.dto';
import { LecturerMapper } from './lecturer.mapper';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';
import { Student } from '../models/student.model';
import { StudentMapper } from './student.mapper';
import { stringify } from 'querystring';

export interface GroupPseudoPersistance {
  day: string;
  hour: string;
  address: string;
  room: string;
  startDate: string;
  endDate: string;
}

export class GroupMapper {
  public static toPersistance(
    createGroupDto: SaveGroupDto,
  ): GroupPseudoPersistance {
    const { day, hour, address, room, startDate, endDate } = createGroupDto;
    return {
      day,
      hour,
      address,
      room,
      startDate,
      endDate,
    };
  }

  public static toDto(
    group: Group,
    lecturers: Lecturer[] = [],
    students: Student[] = [],
  ): GroupDto {
    const { id, day, hour, address, room, startDate, endDate } = group;
    const lecturerDtos = lecturers.map(lecturer =>
      LecturerMapper.toDto(lecturer),
    );
    const studentDtos = students.map(student => StudentMapper.toDto(student));
    return {
      id,
      day,
      hour,
      address,
      room,
      startDate: startDate,
      endDate: endDate,
      lecturers: lecturerDtos,
      students: studentDtos,
    };
  }
}
