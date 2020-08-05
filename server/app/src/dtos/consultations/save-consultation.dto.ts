import { IsString, IsOptional, IsDateString } from 'class-validator';

export class SaveConsultationDto {
  @IsString()
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

  @IsString({ each: true })
  lecturers: string[];

  @IsString({ each: true })
  students: string[];
}
