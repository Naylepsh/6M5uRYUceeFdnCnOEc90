import { UserPassword } from './user.password';
import { Entity } from 'src/core/domain/entity';

interface UserProps {
  firstName: string;
  lastName: string;
  username: string;
  password: UserPassword;
  avatar: string;
}

export class User extends Entity<UserProps> {
  props: UserProps;

  private constructor(props: UserProps, id: string) {
    super(props, id);
  }

  public static async create(props: UserProps, id?: string): Promise<User> {
    return new User(props, id);
  }
}
