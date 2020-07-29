import { LecturerDto } from '../lecturers/lecturer.dto';

export class GroupDto {
  id?: string;
  day: string;
  hour: string;
  address: string;
  room: string;
  startDate: string;
  endDate: string;
  // students: string[];
  lecturers: LecturerDto[];
}
