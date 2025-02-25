export interface IQueue<T> {
  enqueue(message: T): Promise<string>;
}
