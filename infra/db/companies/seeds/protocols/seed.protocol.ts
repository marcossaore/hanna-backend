export interface SeedProtocol<T> {
  seed(param: T): Promise<void>
}
