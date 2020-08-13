import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class SaveConsultationDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @IsDateString()
  datetime: Date;

  @IsString()
  address: string;

  @IsString()
  description: string;

  @IsUUID('4', { each: true })
  lecturers: string[];

  @IsUUID('4', { each: true })
  students: string[];
}
