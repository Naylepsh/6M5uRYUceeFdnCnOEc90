import { getConnection, Connection } from 'typeorm';

interface IEntity {
  name: string;
  tableName: string;
}

export class DatabaseUtility {
  connection: Connection;

  private constructor(connection: Connection) {
    this.connection = connection;
  }

  public static async init(): Promise<DatabaseUtility> {
    const connection = getConnection();
    await connection.synchronize(true);
    return new DatabaseUtility(connection);
  }

  public async cleanDatabase(): Promise<void> {
    const entities = this.getEntities();
    await this.cleanAll(entities);
  }

  private getEntities(): IEntity[] {
    const entities = [];
    this.connection.entityMetadatas.forEach(x =>
      entities.push({ name: x.name, tableName: x.tableName }),
    );

    return entities;
  }

  private async cleanAll(entities: IEntity[]): Promise<void> {
    try {
      for (const entity of entities) {
        const repository = this.connection.getRepository(entity.name);
        await repository.query(`DELETE FROM public.${entity.tableName};`);
      }
    } catch (error) {
      throw new Error(`ERROR: Cleaning test db: ${error}`);
    }
  }
}
