import { GroupDto } from '../groups/group.dto';
import { ConsultationDto } from '../consultations/consultation.dto';

export class LecturerDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  groups: GroupDto[];
  consultations: ConsultationDto[];
}
