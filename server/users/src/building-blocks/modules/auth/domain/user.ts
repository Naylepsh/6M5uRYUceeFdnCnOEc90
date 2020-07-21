import { UserPassword } from './user.password';
import { Entity } from '../../../domain/entity';

interface UserProps {
  username: string;
  password: UserPassword;
}

export class User extends Entity<UserProps> {
  props: UserProps;

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this.props.username;
  }

  get password(): string {
    return this.props.password.value;
  }

  private constructor(props: UserProps, id: string) {
    super(props, id);
  }

  public static async create(props: UserProps, id?: string): Promise<User> {
    return new User(props, id);
  }
}
