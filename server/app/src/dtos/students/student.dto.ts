import { GroupDto } from '../groups/group.dto';
import { ParentDto } from '../parents/parent.dto';
import { ConsultationDto } from '../consultations/consultation.dto';

export class StudentDto {
  id: string;
  firstName: string;
  lastName: string;
  groups: GroupDto[];
  parents: ParentDto[];
  consultations: ConsultationDto[];
}
