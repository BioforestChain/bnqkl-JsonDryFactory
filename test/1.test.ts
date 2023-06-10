import { JSONDryFactory } from "@bfchain/json-dry-factory";
import { deepStrictEqual } from "assert";

const data = {
  s: "qaq",
  r: /qaq/,
  d: {
    nnn: 1,
    bi: 1n,
    // e: new Error("hah"),
  },
  ab: new Uint8Array([1123, 4, 5]),
};
console.log("start testting");
{
  const jsonDry = new JSONDryFactory("qaq");

  const json = jsonDry.stringify(data);
  const jsonData = jsonDry.parse(json);

  deepStrictEqual(jsonData, data, "json error");
}
{
  const objectDry = new JSONDryFactory("qaq", { internalClasses: false });
  const dirty = objectDry.toDirty(data);
  const drityData = objectDry.unDirty(dirty);
  deepStrictEqual(drityData, data, "dirty error");
}
