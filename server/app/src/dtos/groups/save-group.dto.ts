import { IsUUID, IsOptional, IsString } from 'class-validator';

export class SaveGroupDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @IsString()
  day: string;

  @IsString()
  time: string;

  @IsString()
  address: string;

  @IsString()
  room: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsUUID('4', { each: true })
  lecturers: string[];

  @IsUUID('4', { each: true })
  students: string[];
}
