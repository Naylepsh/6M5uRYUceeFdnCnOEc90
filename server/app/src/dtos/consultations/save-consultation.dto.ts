export class SaveConsultationDto {
  id?: string;
  datetime: Date;
  address: string;
  room: string;
  lecturers: string[];
  students: string[];
}
