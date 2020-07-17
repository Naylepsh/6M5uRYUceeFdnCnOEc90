import { UserDto } from 'src/users/dtos/user.dto';
import { UserAuthDto } from '../dtos/user-auth.dto';

export class UserAuthMapper {
  static fromUser(user: UserDto): UserAuthDto {
    const { username, id } = user;
    return { username, id };
  }
}
