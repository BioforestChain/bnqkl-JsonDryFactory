// import { ConsolePro } from 'npm:console-pro';
// const console = new ConsolePro();

const special_char = "~";
const safe_special_char = "\\x7e";
const escaped_safe_special_char = "\\" + safe_special_char;
const special_char_rg = RegExp(safe_special_char, "g");
const safe_special_char_rg = RegExp(escaped_safe_special_char, "g");
const get_regex = /^\/(.*)\/(.*)/;

const ErrorConstructorList = Object.getOwnPropertyNames(globalThis)
  .filter((name) => name.endsWith("Error"))
  .map((errname) => (globalThis as any)[errname]);
const ErrorConstructorSet = new Set(ErrorConstructorList);
ErrorConstructorSet.delete("Error");

const BigTypedArrayConstructorList =
  typeof BigUint64Array === "function" ? [BigInt64Array, BigUint64Array] : [];
const TypedArrayConstructorList =
  typeof Uint8Array === "function"
    ? [
        Uint8Array,
        Uint16Array,
        Uint32Array,
        Int8Array,
        Int16Array,
        Int32Array,
        Float32Array,
        Float64Array,
        ...BigTypedArrayConstructorList,
      ]
    : [];

import { BoolRecoder } from "./BoolRecoder.ts";

const STEP = [
  void 0 /* 保留空位，没用，因为下标是从1开始的 */,
  /* 1 */ 128,
  /* 2 */ 64,
  /* 3 */ 32,
  /* 4 */ 16,
  /* 5 */ 8,
  /* 6 */ 4,
  /* 7 */ 2,
  /* 8 */ 1,
];

export class JSONDryFactory {
  is_in_stringify = 0;
  constructor(
    public nsp: string,
    options: {
      internalClasses?: BFChainJsonDryFactory.InternalClassesOptions | boolean;
    } = {},
  ) {
    const { internalClasses } = options;
    const canRegisterInternalClass = (type: keyof BFChainJsonDryFactory.InternalClassesOptions) => {
      if (
        internalClasses === false ||
        (typeof internalClasses === "object" && internalClasses[type] === false)
      ) {
        return false;
      }
      return true;
    };
    this._DISABLED_RECURSION = Symbol(nsp + ":disabledRecursion");
    this._TODRY_SYMBOL = Symbol(nsp + ":toDry");
    this._UNDRY_SYMBOL = Symbol(nsp + ":unDry");
    this._DRYNAME_SYMBOL = Symbol(nsp + ":dryName");
    // exports.stringify = stringify;
    // exports.toObject = toDryObject;
    // exports.parse = parse;
    // exports.clone = clone;
    // exports.registerClass = registerClass;
    // exports.registerUndrier = registerUndrier;
    // exports.registerDrier = registerDrier;
    this.registerClass(RegExp as any, {
      isDirty: canRegisterInternalClass("RegExp"),
      toDry(ins: any) {
        return ins + "";
      },
      unDry(val: any) {
        return RegExp.apply(undefined, (get_regex.exec(val) || []).slice(1) as any);
      },
    });
    this.registerClass(Date, {
      isDirty: canRegisterInternalClass("Date"),
      toDry(ins: any) {
        return +ins;
      },
      unDry(val: any) {
        return new Date(val);
      },
    });
    if (typeof BigInt === "function") {
      this.registerClass(BigInt as any, {
        isDirty: canRegisterInternalClass("BigInt"),
        name: "bigint",
        toDry(v: bigint) {
          return v.toString();
        },
        unDry(s) {
          return BigInt(s);
        },
      });
    }

    // Error是所有Error的底层，绑定了它一个，其它的Error构造函数就共享了。
    this.registerClass(Error, {
      isDirty: canRegisterInternalClass("Error"),
      toDry(ins: any) {
        // error的这些属性默认是不可遍历的，需要手动取出返回
        const { message, stack } = ins;
        return { message, stack };
      },
      unDry(val: any, Con: any) {
        const err = new Con(val.message);
        Object.defineProperty(err, "stack", {
          enumerable: false,
          value: val.stack,
          configurable: true,
          writable: true,
        });
        // err['stack'] = val.stack;
        return err;
      },
    });
    for (const ErrorConstructor of ErrorConstructorSet.values()) {
      this.registerClass(ErrorConstructor, {
        isDirty: canRegisterInternalClass("Error"),
      });
    }

    // 做一层判断，兼容浏览器端
    if (typeof Buffer === "function") {
      if (canRegisterInternalClass("Buffer")) {
        /// 无法直接传输二进制时，进行反序列化
        /// hex的性能比base64更好，用空间换时间
        this.registerClass(Buffer, {
          toDry(ins) {
            return ins.toString("hex");
          },
          unDry(val, Con) {
            return Buffer.from(val, "hex");
          },
        });
      } else {
        /// nodejs的线程默认无法直接传输Buffer，会被转化成Uint8Array，所以要做一层判断
        this.registerClass(Buffer, {
          toDry(ins) {
            return ins;
          },
          unDry(val) {
            return Buffer.from(val);
          },
        });
      }
      const JSON_SYMBOL = Symbol(nsp + ":toJSON");
      (Buffer.prototype as any)[JSON_SYMBOL] = Buffer.prototype.toJSON;
      const self = this;
      Buffer.prototype.toJSON = function () {
        if (self.is_in_stringify) {
          return this;
        }
        return (this as any)[JSON_SYMBOL]();
      };
    }

    for (const TypedArrayConstructor of TypedArrayConstructorList) {
      this.registerClass(TypedArrayConstructor as any, {
        isDirty: canRegisterInternalClass("TypedArray"),
        toDry(ins) {
          return ins.join(",");
        },
        unDry(val, Con) {
          return new Con(val.split(","));
        },
      });
    }
    this.registerClass(ArrayBuffer, {
      isDirty: canRegisterInternalClass("TypedArray"),
      toDry(ins) {
        return new Uint8Array(ins).join(",");
      },
      unDry(val) {
        return new Uint8Array(val.split(",")).buffer;
      },
    });
    if (typeof SharedArrayBuffer !== "undefined") {
      this.registerClass(SharedArrayBuffer, {
        isDirty: canRegisterInternalClass("TypedArray"),
        toDry(ins) {
          return new Uint8Array(ins).join(",");
        },
        unDry(val) {
          const byteList = val.split(",");
          const sab = new SharedArrayBuffer(byteList.length);
          new Uint8Array(sab).set(byteList);
          return sab;
        },
      });
    }
  }
  readonly Classes = new Map<
    string,
    | {
        Constructor: BFChainJsonDryFactory.ConstructorType<any>;
        isDirty: true;
        toDry: BFChainJsonDryFactory.toDryType<any, any>;
        unDry: BFChainJsonDryFactory.unDryType<any, any>;
        recursion?: boolean;
      }
    | {
        Constructor: BFChainJsonDryFactory.ConstructorType<any>;
        isDirty: false;
      }
  >();

  /**
   * Register a class that can be serialized/revived
   */
  public registerClass<T = any, R = any>(
    Constructor: BFChainJsonDryFactory.ConstructorType<T>,
    opts: {
      name?: string;
      isDirty?: boolean;
      toDry?: BFChainJsonDryFactory.toDryType<T, R>;
      unDry?: BFChainJsonDryFactory.unDryType<T, R>;
      recursion?: boolean;
    } = {},
  ) {
    const name = opts.name || Constructor.name;
    const sou = this.Classes.get(name);
    if (sou) {
      if (sou.Constructor !== Constructor) {
        throw Error(`class ${name} already registered.`);
      }
    }
    // 需要在构造函数身上绑定注册的名字
    Constructor.prototype[this._DRYNAME_SYMBOL] = name;

    const { isDirty = true } = opts;

    if (isDirty === false) {
      this.Classes.set(name, {
        Constructor,
        isDirty,
      });
      Constructor.prototype[this._DISABLED_RECURSION] = true;
      return;
    }

    /**是否需要在原型链上绑定toDry函数
     * 1. opts有自定义的toDry
     * 2. 原型链上没有toDry
     */
    const need_set_toDry = opts.toDry || !Constructor.prototype[this._TODRY_SYMBOL];
    const toDry =
      opts.toDry ||
      Constructor.prototype[this._TODRY_SYMBOL] ||
      ((ins: T) => {
        const res: any = {};
        for (let k in ins) {
          res[k] = ins[k];
        }
        return res;
      });
    /**是否需要在原型链上绑定unDry函数
     * 1. opts有自定义的unDry
     * 2. 构造函数上没有unDry
     */
    const need_set_unDry = opts.unDry || !(Constructor as any)[this._UNDRY_SYMBOL];
    const unDry =
      opts.unDry ||
      (Constructor as any)[this._UNDRY_SYMBOL] ||
      ((obj: any) => {
        // Object.setPrototypeOf(obj, Constructor.prototype)
        // 复制一份
        const res = Object.create(Constructor.prototype);
        for (let k in obj) {
          res[k] = obj[k];
        }
        return obj;
      });
    delete Constructor.prototype[this._TODRY_SYMBOL];
    if (need_set_toDry) {
      // 需要在构造函数的原型链上绑定toDry和unDry，这样它们的子类也能共享
      Constructor.prototype[this._TODRY_SYMBOL] = toDry;
    }
    delete (Constructor as any)[this._UNDRY_SYMBOL];
    if (need_set_unDry) {
      (Constructor as any)[this._UNDRY_SYMBOL] = unDry;
    }

    this.Classes.set(name, {
      Constructor,
      isDirty,
      toDry,
      unDry,
      recursion: opts.recursion,
    });
  }
  private _DISABLED_RECURSION: symbol;
  private _TODRY_SYMBOL: symbol;
  private _UNDRY_SYMBOL: symbol;
  private _DRYNAME_SYMBOL: symbol;

  /**
   * Convert directly to a string
   *
   */

  public stringify: typeof JSON.stringify = (obj: any, replacer?: any, space?: any) => {
    return JSON.stringify(this.toDirty(obj, replacer), space);
  };

  /**
   * Convert from a dried object
   *
   */
  public parse: typeof JSON.parse = (json: string, reviver?) => {
    return this.unDirty(JSON.parse(json), reviver);
  };

  toDirty(obj: any, replacer?: any) {
    const br = new BoolRecoder();
    const { _DRYNAME_SYMBOL } = this;
    const toDirtyReplacer = (k: string, v: any) => {
      v = replacer ? replacer(k, v) : v;
      const dryName = v !== undefined && v !== null && v[_DRYNAME_SYMBOL];
      let isRecord = false;
      if (dryName) {
        const class_info = this.Classes.get(dryName);
        if (class_info) {
          isRecord = true;
          if (class_info.isDirty) {
            const dirtyDatas = [dryName];
            /// 这里直接提供dirtyDatas对象，目的是允许开发者将更多的数据存储在dirtyDatas这个数组上，从而节省数据结构
            const dirtyValue = class_info.toDry(v, dirtyDatas);
            if (dirtyValue === dirtyDatas) {
              /// 如果的对象就是dirtyDatas本身，说明开发者已经完全自己接手处理dirtyDatas的模型。因此recursion必须是false
              if (class_info.recursion) {
                throw new Error("if return dirtyDatas, recursion shoule only be false");
              }
              (dirtyDatas as any)[this._DISABLED_RECURSION] = true;
            } else if (class_info.recursion) {
              dirtyDatas[1] = this.toDirty(dirtyValue, replacer);
            } else {
              dirtyDatas[1] = dirtyValue;
              // Object.defineProperty(v,DISABLED_RECURSION,{enumerable:false,writable:false,value:true,configurable:false})
              (dirtyDatas as any)[this._DISABLED_RECURSION] = true;
            }
            v = dirtyDatas;
          }
        } else {
          console.warn(`dry class ${dryName} no found.`);
        }
      }

      br.record(isRecord);
      return v;
    };
    const cloneAny = (obj: any) => {
      if (typeof obj === "object" && obj !== null && !obj[this._DISABLED_RECURSION]) {
        const cobj: any = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
          const value = obj[key];
          if (value === undefined) {
            /// JSON 是不会存储 undefined，所以直接跳过
            continue;
          }
          cobj[key] = cloneAny(toDirtyReplacer(key, value));
        }
        return cobj;
      }
      return obj;
    };
    obj = cloneAny(toDirtyReplacer("", obj));

    /// 最后对空步进行特殊优化
    const walk = br.walk;
    if (walk.length && walk.every((s) => s === 0)) {
      walk.length = 0;
    }
    return [obj, walk] as const;
  }
  unDirty(dirty: ReturnType<JSONDryFactory["toDirty"]>, reviver?: any) {
    const [obj, walk] = dirty;
    if (walk.length === 0) {
      return obj;
    }
    const br = new BoolRecoder(walk);
    const brPlayer = br.play();

    const recovryAny = (key: string, obj: any) => {
      const isDirty = brPlayer.next().value;
      if (isDirty) {
        if (Array.isArray(obj)) {
          const dirtyDatas = obj;
          const dryName = dirtyDatas[0];
          const dirtyValue = dirtyDatas[1];
          const class_info = this.Classes.get(dryName);
          if (class_info?.isDirty) {
            if (class_info.recursion) {
              obj = class_info.unDry(
                this.unDirty(dirtyValue, reviver),
                class_info.Constructor,
                dirtyDatas,
              );
            } else {
              obj = class_info.unDry(dirtyValue, class_info.Constructor, dirtyDatas);
            }
          } else {
            console.warn(`dry class ${dryName} no found.`);
          }
        }
      } else {
        if (typeof obj === "object" && obj !== null) {
          const cobj: any = Array.isArray(obj) ? [] : {};
          for (const key in obj) {
            cobj[key] = recovryAny(key, obj[key]);
          }
          obj = cobj;
        }
      }
      obj = reviver ? reviver(key, obj) : obj;
      return obj;
    };
    return recovryAny("", obj);
  }
}
