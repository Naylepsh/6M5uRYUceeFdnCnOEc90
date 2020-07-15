import { UserDto } from './../users/dtos/user.dto';

let users: UserDto[] = [];

export class FakeDatabase {
  static findAll(): UserDto[] {
    return users;
  }

  static findById(id: string): UserDto[] {
    return users.filter(user => user.id === id);
  }

  static createUser(user: UserDto): void {
    users.push(user);
  }

  static updateUser(id: string, updatedUserData: UserDto): void {
    users = users.map(user => {
      if (user.id === id) {
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
