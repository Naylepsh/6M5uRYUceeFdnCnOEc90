import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ParentRepository } from './../repositories/parent.repository';
import { Parent } from '../models/parent.model';

@Injectable()
export class ParentsByIdsPipe implements PipeTransform<any> {
  parentRepository: ParentRepository;

  constructor() {
    const connection = getConnection();
    this.parentRepository = new ParentRepository(connection);
  }

  async transform(ids: string[]): Promise<Parent[]> {
    const parents = await this.parentRepository.findByIds(ids);
    if (parents.length < ids.length) {
      throw new BadRequestException('Some of the given parents do not exist');
    }
    return parents;
  }
}
