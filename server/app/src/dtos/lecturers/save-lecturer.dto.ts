import { IsOptional, IsUUID, IsString, IsEmail } from 'class-validator';

export class SaveLecturerDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsUUID('4', { each: true })
  groups: string[];
}
