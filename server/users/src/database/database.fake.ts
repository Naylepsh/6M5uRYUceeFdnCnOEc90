let users = [];

export class FakeDatabase {
  findAll() {
    return users;
  }

  findById(id: string) {
    return users.filter(user => user.id === id);
  }

  createUser(user): void {
    users.push(user);
  }

  updateUser(id: string, updatedUserData): void {
    users = users.map(user => {
      if (user.id === id) {
        return updatedUserData;
      } else {
        return user;
      }
    });
  }

  deleteUser(id: string): void {
    users = users.filter(user => user.id !== id);
  }
}
