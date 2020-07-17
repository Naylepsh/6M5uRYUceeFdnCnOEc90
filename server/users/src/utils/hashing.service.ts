import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashingService {
  async hash(data: string): Promise<string> {
    const salt = 10;
    return await bcryptHash(data, salt);
  }

  async compare(data: string, hashed: string): Promise<boolean> {
    return await bcryptCompare(data, hashed);
  }
}
