export interface Lazy<T1, T2> {
  load(options: T1): T2
}
