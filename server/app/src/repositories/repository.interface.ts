export interface IRepository<Model> {
  findAll(): Promise<Model[]>;
  findById(id: string): Promise<Model>;
  create(model: Model): Promise<Model>;
  update(model: Model): Promise<void>;
  delete(id: string): Promise<void>;
}
