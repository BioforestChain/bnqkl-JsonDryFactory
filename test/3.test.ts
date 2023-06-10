import { JSONDryFactory } from "@bfchain/json-dry-factory";
const jsonFac = new JSONDryFactory("test1");
const json = jsonFac.stringify({ b: Buffer.from("开心就好"), e: new Error("qaq") });
console.log(json);
const obj = jsonFac.parse(json);
console.log(obj.b);
console.assert(obj.b instanceof Buffer, "buffer parse error");
