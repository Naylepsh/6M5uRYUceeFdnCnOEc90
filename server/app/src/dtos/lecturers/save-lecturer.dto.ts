import {
  IsOptional,
  IsUUID,
  IsString,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class SaveLecturerDto {
  @IsUUID('4')
  @IsOptional()
  id?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsPhoneNumber('pl') // null for region doesnt matter
  phoneNumber: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsUUID('4', { each: true })
  groups: string[];

  @IsUUID('4', { each: true })
  consultations: string[];
}
