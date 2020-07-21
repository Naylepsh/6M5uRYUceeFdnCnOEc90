import { Profile } from '../domain/profile';

export class ProfileDbMapper {
  public static async fromPersistance(profile: any): Promise<Profile> {
    const props = {
      firstName: profile.firstName + '',
      lastName: profile.lastName + '',
      username: profile.username + '',
      avatarUrl: profile.avatarUrl + '',
    };
    return Profile.create(props, profile.id);
  }
}
