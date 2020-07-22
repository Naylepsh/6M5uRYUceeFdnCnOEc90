import { User } from '../../domain/user';
import { UserPassword } from '../../domain/user.password';

export class UserDbMapper {
  public static async fromPersistance(user: any): Promise<User> {
    const password = await UserPassword.create({
      value: user.password,
      hashed: true,
    });
    const props = {
      username: user.username + '',
      password,
    };
    return User.create(props, user.id);
  }
}
