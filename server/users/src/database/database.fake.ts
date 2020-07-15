import { UserDto } from './../users/dtos/user.dto';

let users: UserDto[] = [];

export class FakeDatabase {
  static findAll(): UserDto[] {
    return users;
  }

  static findById(id: string): UserDto {
    const foundUsers = users.filter(user => user.id === id);
    const user = foundUsers ? foundUsers[0] : undefined;
    return user;
  }

  static createUser(user: UserDto): void {
    const id = users.length + '';
    users.push({ ...user, id });
  }

  static updateUser(updatedUserData: UserDto): void {
    users = users.map(user => {
      if (user.id === updatedUserData.id) {
        return updatedUserData;
      } else {
        return user;
      }
    });
  }

  static deleteUser(id: string): void {
    users = users.filter(user => user.id !== id);
  }
}
