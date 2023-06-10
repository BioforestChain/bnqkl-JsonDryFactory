export {};
declare global {
  export namespace BFChainJsonDryFactory {
    export type ConstructorType<T> = new (...args: any[]) => T;

    export type toDryType<T, R> = (ins: T, dirtyDatas: any[]) => R | any[];

    export type unDryType<T, R> = (obj: R, Constructor: ConstructorType<T>, dirtyDatas: any[]) => T;

    export type InternalClassesOptions = Partial<{
      RegExp: boolean;
      Date: boolean;
      BigInt: boolean;
      Error: boolean;
      Buffer: boolean;
      TypedArray: boolean;
    }>;
  }
}
