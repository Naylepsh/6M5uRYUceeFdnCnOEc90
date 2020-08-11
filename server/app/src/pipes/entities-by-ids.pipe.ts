import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { IRepository } from '../repositories/repository.interface';

@Injectable()
export class EntitiesByIdsPipe<Entity> implements PipeTransform<any> {
  protected errorMessage = 'Some of the entities do not exist';

  constructor(protected readonly entityRepository: IRepository<Entity>) {}

  async transform(ids: string[]): Promise<Entity[]> {
    const entites = await this.entityRepository.findByIds(ids);
    if (entites.length < ids.length) {
      throw new BadRequestException(this.errorMessage);
    }
    return entites;
  }
}
