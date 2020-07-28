import { LecturerDto } from '../lecturers/lecturer.dto';

export class GroupDto {
  id: string;
  lecturers: LecturerDto[];
}
