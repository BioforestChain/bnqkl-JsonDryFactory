import { JSONDryFactory } from "@bfchain/json-dry-factory";
const jsonDry = new JSONDryFactory("bigint");
console.log(jsonDry.parse(jsonDry.stringify(1n)));
console.log(jsonDry.parse(jsonDry.stringify(0n)));
console.log("√ all passed.");
