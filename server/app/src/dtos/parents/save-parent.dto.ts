import { IsUUID, IsOptional, IsString, IsEmail } from 'class-validator';

export class SaveParentDto {
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
  children: string[];
}
