import { Injectable, PipeTransform } from '@nestjs/common';
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
    return parents;
  }
}
