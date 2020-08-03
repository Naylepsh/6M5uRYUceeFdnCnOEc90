import { GroupDto } from '../groups/group.dto';

export class LecturerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  groups: GroupDto[];
}
