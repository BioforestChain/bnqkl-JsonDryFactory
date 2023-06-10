import { JSONDryFactory } from "@bfchain/json-dry-factory";
const jsonFac = new JSONDryFactory("test1");
const json = jsonFac.stringify({
  a: "QAQ",
  r: /z\d([1-z]+?)/g,
  d: new Date(),
  mix: { "4": 3, o: new Date(), 0: "1" },
  e: new Error("cccc"),
  deep: {
    a: {
      b: {
        x: /44/,
        c: {
          m: "ccc",
          s: /cc/,
        },
      },
      xx: "432cc1",
      x: 4321,
      bb: /cf/,
    },
  },
});
console.log(json);
const obj = jsonFac.parse(json);
console.log("-----------------------");
console.log(obj, typeof obj.d);
