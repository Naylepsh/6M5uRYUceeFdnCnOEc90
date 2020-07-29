import { Group } from '../models/group.model';
import { Lecturer } from '../models/lecturer.model';
import { GroupDto } from '../dtos/groups/group.dto';
import { LecturerMapper } from './lecturer.mapper';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';

interface GroupPseudoPersistance {
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

  public static toDto(group: Group, lecturers: Lecturer[]): GroupDto {
    const { id } = group;
    const groups = [];
    const lecturerDtos = lecturers.map(lecturer =>
      LecturerMapper.toDto(lecturer, groups),
    );
    return { id, lecturers: lecturerDtos };
  }
}
