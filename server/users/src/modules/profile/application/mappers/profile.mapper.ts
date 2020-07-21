import { Profile } from '../../domain/profile';
import { ProfileDto } from '../dtos/profile.dto';

export class ProfileMapper {
  public static fromProfileToDto(profile: Profile): ProfileDto {
    if (profile && profile.props) {
      return {
        id: profile.id,
        ...profile.props,
      };
    }
  }
}
