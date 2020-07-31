import { getConnection } from 'typeorm';

export class RelationManager {
  constructor(
    private readonly model: any,
    private readonly relationName: string,
  ) {}

  insertRelation(targetId: string, relationsToAdd: string[]): Promise<void> {
    return getConnection()
      .createQueryBuilder()
      .relation(this.model, this.relationName)
      .of(targetId)
      .add(relationsToAdd);
  }

  updateRelation(
    targetId: string,
    relationsToAdd: string[],
    relationsToRemove: string[],
  ): Promise<void> {
    return getConnection()
      .createQueryBuilder()
      .relation(this.model, this.relationName)
      .of(targetId)
      .addAndRemove(relationsToAdd, relationsToRemove);
  }
}
