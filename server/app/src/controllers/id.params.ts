import { IsUUID } from 'class-validator';

export class IdParams {
  @IsUUID('4')
  id: string;
}
