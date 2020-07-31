import { Injectable } from '@nestjs/common';
import { Parent } from '../models/parent.model';
import { getConnection } from 'typeorm';
import { SaveParentDto } from '../dtos/parents/save-parent.dto';
import { ParentMapper } from '../mappers/parent.mapper';
import { ParentDto } from '../dtos/parents/parent.dto';
import { ParentPseudoPersistance } from './../mappers/parent.mapper';
import { RelationManager } from './helpers/relation';
import { Student } from '../models/student.model';

@Injectable()
export class ParentRepository {
  groupRelationManager: RelationManager;
  constructor() {
    this.groupRelationManager = new RelationManager(Parent, 'children');
  }

  async findAll(): Promise<ParentDto[]> {
    const parentss = await getConnection()
      .createQueryBuilder()
      .select('parents')
      .from(Parent, 'parents')
      .leftJoinAndSelect('parents.children', 'children')
      .getMany();
    return parentss.map(parents =>
      ParentMapper.toDto(parents, parents.children),
    );
  }

  async findById(id: string): Promise<ParentDto> {
    const parents = await getConnection()
      .createQueryBuilder()
      .select('parents')
      .from(Parent, 'parents')
      .where('parents.id = :id', { id })
      .leftJoinAndSelect('parents.children', 'children')
      .getOne();
    if (!parents) return null;
    return ParentMapper.toDto(parents, parents.children);
  }

  async create(createParentDto: SaveParentDto): Promise<ParentDto> {
    const parentsToSave = ParentMapper.toPersistance(createParentDto);
    const id = await this.insertParentFields(parentsToSave);
    await this.groupRelationManager.insertRelation(
      id,
      createParentDto.children,
    );

    return this.findById(id);
  }

  private async insertParentFields(
    parentsToSave: ParentPseudoPersistance,
  ): Promise<string> {
    const parents = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Parent)
      .values([parentsToSave])
      .execute();
    const id = parents.identifiers[0]['id'];
    return id;
  }

  async update(createParentDto: SaveParentDto): Promise<void> {
    const id = createParentDto.id;
    const parentsToSave = ParentMapper.toPersistance(createParentDto);
    const parents = await this.findById(id);
    await this.updateParentFields(id, parentsToSave);
    const childrenToRemove = parents.children.map(group => group.id);
    await this.groupRelationManager.updateRelation(
      id,
      createParentDto.children,
      childrenToRemove,
    );
  }

  private async updateParentFields(
    id: string,
    parentsToSave: ParentPseudoPersistance,
  ): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .update(Parent)
      .set(parentsToSave)
      .where('id = :id', { id })
      .execute();
  }

  async delete(id: string): Promise<void> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Parent)
      .where('id = :id', { id })
      .execute();
  }
}
