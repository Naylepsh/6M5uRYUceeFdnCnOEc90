import { StudentDto } from '../students/student.dto';

export class ParentDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  children: StudentDto[];
}
