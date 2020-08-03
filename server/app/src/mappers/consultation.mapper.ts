import { Consultation } from '../models/consultation.model';
import { Lecturer } from '../models/lecturer.model';
import { ConsultationDto } from '../dtos/consultations/consultation.dto';
import { LecturerMapper } from './lecturer.mapper';
import { SaveConsultationDto } from '../dtos/consultations/save-consultation.dto';
import { Student } from '../models/student.model';
import { StudentMapper } from './student.mapper';

export interface ConsultationPseudoPersistance {
  datetime: Date;
  address: string;
  room: string;
}

export class ConsultationMapper {
  public static toPersistance(
    createConsultationDto: SaveConsultationDto,
  ): ConsultationPseudoPersistance {
    const { datetime, address, room } = createConsultationDto;
    return {
      datetime,
      address,
      room,
    };
  }

  public static toDto(
    consultation: Consultation,
    lecturers: Lecturer[] = [],
    students: Student[] = [],
  ): ConsultationDto {
    const { id, datetime, address, room } = consultation;
    const lecturerDtos = lecturers.map(lecturer =>
      LecturerMapper.toDto(lecturer),
    );
    const studentDtos = students.map(student =>
      StudentMapper.toDto(student, [], student.parents),
    );
    return {
      id,
      datetime,
      address,
      room,
      lecturers: lecturerDtos,
      students: studentDtos,
    };
  }
}
