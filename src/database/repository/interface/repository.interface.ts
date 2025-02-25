export interface IRepository<T> {
  save(register: T): Promise<void>;
}
