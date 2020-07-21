import { User } from '../../domain/user';
import { UserDto } from '../dtos/user.dto';
import { UserPassword } from '../../domain/user.password';

export class UserMapper {
  public static fromUserToDto(user: User): UserDto {
    if (user && user.props && user.props.password) {
      return {
        id: user.id,
        ...user.props,
        password: user.props.password.value,
      };
    }
  }

  public static async fromDtoToUser(userDto: UserDto): Promise<User> {
    const password = await UserPassword.create({ value: userDto.password });
    const props = { ...userDto, password };
    return User.create(props, userDto.id);
  }
}
