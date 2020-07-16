import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

export async function hash(data: string): Promise<string> {
  const salt = 10;
  return await bcryptHash(data, salt);
}

export async function compare(data: string, hashed: string): Promise<boolean> {
  return await bcryptCompare(data, hashed);
}
