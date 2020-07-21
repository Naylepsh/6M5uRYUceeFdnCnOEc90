interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  password: string;
}

let users: IUser[] = [];

export class FakeDatabase {
  static findAll(): IUser[] {
    return [...users];
  }

  static findById(id: string): IUser {
    return users.find(user => user.id === id);
  }

  static findOneByUsername(username: string): IUser {
    return users.find(user => user.username === username);
  }

  static createUser(user: IUser): void {
    users.push(user);
  }

  static updateUser(updatedUserData: IUser): void {
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
