import { GroupDto } from '../groups/group.dto';
import { ParentDto } from '../parents/parent.dto';

export class StudentDto {
  id: string;
  firstName: string;
  lastName: string;
  groups: GroupDto[];
  parents: ParentDto[];
}
