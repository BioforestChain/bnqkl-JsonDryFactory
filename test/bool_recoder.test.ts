import { BoolRecoder } from "@bfchain/json-dry-factory";

/**测试N次 */
for (let t = 0; t < 100; ++t) {
  const testData = Array.from({ length: t }, () => Math.random() < 0.5);
  const binaryWalker = new BoolRecoder();
  for (const v of testData) {
    binaryWalker.record(v);
  }

  const playData = [...binaryWalker.play()].slice(0, testData.length);
  for (const [index, v] of testData.entries()) {
    if (playData[index] !== v) {
      throw new Error(`testData:${testData}; playData:${playData}; index:${index}`);
    }
  }
}
