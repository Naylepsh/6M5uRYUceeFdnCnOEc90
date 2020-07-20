import { User } from 'src/modules/users/domain/user';

let users: User[] = [];

export class FakeDatabase {
  static findAll(): User[] {
    return [...users];
  }

  static findById(id: string): User {
    return users.find(user => user.id === id);
  }

  static findOneByUsername(username: string): User {
    return users.find(user => user.props.username === username);
  }

  static createUser(user: User): void {
    users.push(user);
  }

  static updateUser(updatedUserData: User): void {
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
