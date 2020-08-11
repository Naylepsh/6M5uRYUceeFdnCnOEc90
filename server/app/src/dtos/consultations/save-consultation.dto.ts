import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class SaveConsultationDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  // Validation is done on values before they're casted to their go-to type
  // thus why DateString instead of Date
  @IsDateString()
  datetime: Date;

  @IsString()
  address: string;

  @IsString()
  room: string;

  @IsString()
  description: string;

  @IsUUID('4', { each: true })
  lecturers: string[];

  @IsUUID('4', { each: true })
  students: string[];
}
