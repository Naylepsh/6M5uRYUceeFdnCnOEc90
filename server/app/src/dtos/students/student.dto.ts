import { GroupDto } from '../groups/group.dto';

export class StudentDto {
  id: string;
  firstName: string;
  lastName: string;
  groups: GroupDto[];
}
