import { UserDto } from './../users/dtos/user.dto';

let users: UserDto[] = [];

export class FakeDatabase {
  static findAll(): UserDto[] {
    return users;
  }

  static findById(id: string): UserDto {
    const foundUsers = users.filter(user => user.id === id);
    return foundUsers ? foundUsers[0] : null;
  }

  static createUser(user: UserDto): void {
    users.push(user);
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
