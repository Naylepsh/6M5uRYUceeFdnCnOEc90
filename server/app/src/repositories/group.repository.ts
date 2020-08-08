import { Injectable } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import { Group } from '../models/group.model';

@Injectable()
export class GroupRepository {
  repository: Repository<Group>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(Group);
  }

  async findAll(): Promise<Group[]> {
    const groups = await this.repository.find({
      relations: ['lecturers', 'students'],
    });
    return groups;
  }

  async findById(id: string): Promise<Group> {
    const group = await this.repository.findOne({
      where: { id },
      relations: ['lecturers', 'students'],
    });
    return group;
  }

  async findByIds(ids: string[]): Promise<Group[]> {
    if (ids.length == 0) return [];
    const groups = await this.repository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getMany();
    return groups;
  }

  async create(group: Group): Promise<Group> {
    const savedGroup = await this.repository.save(group);
    return savedGroup;
  }

  async update(group: Group): Promise<void> {
    await this.repository.save(group);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
