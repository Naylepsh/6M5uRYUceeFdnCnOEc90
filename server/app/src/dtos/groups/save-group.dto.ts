export class SaveGroupDto {
  id?: string;
  day: string;
  hour: string;
  address: string;
  room: string;
  startDate: string;
  endDate: string;
  lecturers: string[];
  students: string[];
}