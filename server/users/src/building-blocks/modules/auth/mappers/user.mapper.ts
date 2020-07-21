import { User } from '../domain/user';
import { UserAuthDto } from '../dtos/user-auth.dto';

export class UserAuthMapper {
  public static fromUserToDto(profile: User): UserAuthDto {
    if (profile && profile.props && profile.props.password) {
      return {
        ...profile.props,
        password: profile.props.password.value,
      };
    }
  }
}
