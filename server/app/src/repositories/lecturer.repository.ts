import { Injectable } from '@nestjs/common';
import { Lecturer } from '../models/lecturer.model';
import { EntityRepository, Repository, Connection } from 'typeorm';

@Injectable()
@EntityRepository(Lecturer)
export class LecturerRepository {
  repository: Repository<Lecturer>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(Lecturer);
  }

  async findAll(): Promise<Lecturer[]> {
    const lecturers = await this.repository.find({ relations: ['groups'] });
    return lecturers;
  }

  async findById(id: string): Promise<Lecturer> {
    const lecturer = await this.repository.findOne({
      where: { id },
      relations: ['groups'],
    });
    return lecturer;
  }

  async findByIds(ids: string[]): Promise<Lecturer[]> {
    if (ids.length == 0) return [];
    const lecturers = await this.repository
      .createQueryBuilder('lecturer')
      .where('lecturer.id IN (:...ids)', { ids })
      .getMany();
    return lecturers;
  }

  async create(lecturer: Lecturer): Promise<Lecturer> {
    const res = await this.repository.save(lecturer);
    return res;
  }

  async update(lecturer: Lecturer): Promise<void> {
    await this.repository.save(lecturer);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
