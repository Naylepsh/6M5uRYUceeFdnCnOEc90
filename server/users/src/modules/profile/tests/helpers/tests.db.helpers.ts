import { FakeDatabase } from '../../../../database/database.fake';

export function cleanDatabase(): void {
  const profiles = FakeDatabase.findAll();
  for (const profile of profiles) {
    FakeDatabase.deleteUser(profile.id);
  }
}

export function populateDatabase(profiles: any[]): void {
  for (const profile of profiles) {
    FakeDatabase.createUser(profile);
  }
}
