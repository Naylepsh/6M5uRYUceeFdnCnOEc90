import { UserPassword } from './user.password';
import { Entity } from '../../../building-blocks/domain/entity';

interface UserProps {
  firstName: string;
  lastName: string;
  username: string;
  password: UserPassword;
  avatarUrl: string;
}

export class User extends Entity<UserProps> {
  props: UserProps;

  get id(): string {
    return this._id;
  }

  private constructor(props: UserProps, id: string) {
    super(props, id);
  }

  public static async create(props: UserProps, id?: string): Promise<User> {
    return new User(props, id);
  }
}
