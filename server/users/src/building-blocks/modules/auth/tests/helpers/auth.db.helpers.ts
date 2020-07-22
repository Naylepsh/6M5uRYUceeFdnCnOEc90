import { hash } from 'bcrypt';
import { FakeDatabase } from '../../../../../database/database.fake';

export function cleanDatabase(): void {
  const profiles = FakeDatabase.findAll();
  for (const profile of profiles) {
    FakeDatabase.deleteUser(profile.id);
  }
}

export async function populateDatabase(profiles: any[]): Promise<void> {
  const salt = 1;
  for (const profile of profiles) {
    const password = await hash(profile.password, salt);
    FakeDatabase.createUser({ ...profile, password });
  }
}
