import { Injectable } from '@nestjs/common';
import { Parent } from '../models/parent.model';
import { Repository, Connection } from 'typeorm';
import { IRepository } from './repository.interface';

@Injectable()
export class ParentRepository implements IRepository<Parent> {
  repository: Repository<Parent>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(Parent);
  }

  async findAll(): Promise<Parent[]> {
    const parents = await this.repository.find({ relations: ['children'] });
    return parents;
  }

  async findById(id: string): Promise<Parent> {
    const parent = await this.repository.findOne({
      where: { id },
      relations: ['children'],
    });
    return parent;
  }

  async findByIds(ids: string[]): Promise<Parent[]> {
    if (ids.length == 0) return [];
    const parents = await this.repository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getMany();
    return parents;
  }

  async create(parent: Parent): Promise<Parent> {
    const res = await this.repository.save(parent);
    return res;
  }

  async update(parent: Parent): Promise<void> {
    await this.repository.save(parent);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
