import { Injectable } from '@nestjs/common';
import { Student } from '../models/student.model';
import { Repository, Connection } from 'typeorm';

@Injectable()
export class StudentRepository {
  repository: Repository<Student>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(Student);
  }

  async findAll(): Promise<Student[]> {
    const students = await this.repository.find({
      relations: ['groups', 'parents'],
    });
    return students;
  }

  async findById(id: string): Promise<Student> {
    const student = await this.repository.findOne({
      where: { id },
      relations: ['groups', 'parents'],
    });
    return student;
  }

  async findByIds(ids: string[]): Promise<Student[]> {
    if (ids.length == 0) return [];
    const students = await this.repository
      .createQueryBuilder()
      .where('id IN (:...ids)', { ids })
      .getMany();
    return students;
  }

  async create(student: Student): Promise<Student> {
    const res = await this.repository.save(student);
    return res;
  }

  async update(student: Student): Promise<void> {
    const { id } = student;
    delete student.id;
    await this.repository.update(id, student);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
