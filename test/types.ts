declare namespace BFChainJsonDryFactory {
  type ConstructorType<T> = new (...args: any[]) => T;

  type toDryType<T, R> = (ins: T, dirtyDatas: any[]) => R | any[];

  type unDryType<T, R> = (obj: R, Constructor: ConstructorType<T>, dirtyDatas: any[]) => T;

  type InternalClassesOptions = Partial<{
    RegExp: boolean;
    Date: boolean;
    BigInt: boolean;
    Error: boolean;
    Buffer: boolean;
    TypedArray: boolean;
  }>;
}
