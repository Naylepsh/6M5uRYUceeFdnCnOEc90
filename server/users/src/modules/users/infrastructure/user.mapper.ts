import { User } from '../domain/user';
import { UserPassword } from '../domain/user.password';

export class UserDbMapper {
  public static async fromPersistance(user: any): Promise<User> {
    const password = await UserPassword.create({
      value: user.password,
      hashed: true,
    });
    const props = {
      firstName: user.firstName + '',
      lastName: user.lastName + '',
      username: user.username + '',
      avatarUrl: user.avatarUrl + '',
      password,
    };
    return User.create(props, user.id);
  }

  public static toPersistance(user: User): any {
    return {
      ...user.props,
      id: user.id,
      password: user.props.password.value,
    };
  }
}
