import { IsUUID, IsOptional, IsString } from 'class-validator';

export class SaveStudentDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsUUID('4', { each: true })
  groups: string[];

  @IsUUID('4', { each: true })
  parents: string[];

  @IsUUID('4', { each: true })
  consultations: string[];
}
