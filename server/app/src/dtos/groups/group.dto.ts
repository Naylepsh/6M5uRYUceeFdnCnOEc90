import { LecturerDto } from '../lecturers/lecturer.dto';
import { StudentDto } from '../students/student.dto';

export class GroupDto {
  id?: string;
  day: string;
  time: string;
  address: string;
  startDate: string;
  endDate: string;
  students: StudentDto[];
  lecturers: LecturerDto[];
}
