import { LecturerDto } from '../lecturers/lecturer.dto';
import { StudentDto } from '../students/student.dto';

export class ConsultationDto {
  id: string;
  datetime: Date;
  address: string;
  description: string;
  students: StudentDto[];
  lecturers: LecturerDto[];
}
