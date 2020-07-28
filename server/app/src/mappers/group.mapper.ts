import { Group } from '../models/group.model';
import { Lecturer } from '../models/lecturer.model';
import { GroupDto } from '../dtos/groups/group.dto';
import { LecturerMapper } from './lecturer.mapper';

export class GroupMapper {
  public static toDto(group: Group, lecturers: Lecturer[]): GroupDto {
    const { id } = group;
    const groups = [];
    const lecturerDtos = lecturers.map(lecturer =>
      LecturerMapper.toDto(lecturer, groups),
    );
    return { id, lecturers: lecturerDtos };
  }
}
