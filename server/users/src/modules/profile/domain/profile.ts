import { Entity } from '../../../building-blocks/domain/entity';

interface ProfileProps {
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
}

export class Profile extends Entity<ProfileProps> {
  props: ProfileProps;

  get id(): string {
    return this._id;
  }

  private constructor(props: ProfileProps, id: string) {
    super(props, id);
  }

  public static async create(
    props: ProfileProps,
    id?: string,
  ): Promise<Profile> {
    return new Profile(props, id);
  }
}
