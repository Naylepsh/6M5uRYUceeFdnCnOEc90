import { ValueObject } from './../../../core/domain/value-object';
import { compare, hash } from 'bcrypt';

interface UserPasswordProps {
  value: string;
}

export class UserPassword extends ValueObject<UserPasswordProps> {
  private constructor(props: UserPasswordProps) {
    super(props);
  }

  public static async create(props: UserPasswordProps): Promise<UserPassword> {
    const password = await UserPassword.hashPassword(props.value);
    return new UserPassword({ ...props, value: password });
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = 8;
    return hash(password, salt);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    return compare(plainTextPassword, this.props.value);
  }

  get value(): string {
    return this.props.value;
  }
}
