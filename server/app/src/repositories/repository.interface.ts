export interface IRepository<Entity> {
  findAll(): Promise<Entity[]>;
  findById(id: string): Promise<Entity>;
  findByIds(ids: string[]): Promise<Entity[]>;
  create(model: Entity): Promise<Entity>;
  update(model: Entity): Promise<void>;
  delete(id: string): Promise<void>;
}
