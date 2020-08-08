import { Group } from '../models/group.model';
import { GroupDto } from '../dtos/groups/group.dto';
import { SaveGroupDto } from '../dtos/groups/save-group.dto';
import { Repository, getConnection } from 'typeorm';

export class GroupMapper {
  static groupRepository: Repository<Group>;

  public static toPersistance(createGroupDto: SaveGroupDto): Group {
    this.ensureRepoIsInitialized();
    const { day, time, address, room, startDate, endDate } = createGroupDto;
    const obj = {
      day,
      time,
      address,
      room,
      startDate,
      endDate,
    };
    return this.groupRepository.create(obj);
  }

  public static toDto(group: Group): GroupDto {
    const {
      id,
      day,
      time,
      address,
      room,
      startDate,
      endDate,
      lecturers,
      students,
    } = group;
    return {
      id,
      day,
      time,
      address,
      room,
      startDate,
      endDate,
      lecturers,
      students,
    };
  }

  private static ensureRepoIsInitialized() {
    if (!this.groupRepository) {
      this.groupRepository = getConnection().getRepository(Group);
    }
  }
}
