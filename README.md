# JSON dry Factory

create an `JSON` instance, and registered isolated serialization/deserialization handlers for custom classes.

Importantly, it is possible that a Class is registered with multiple JSON-dry instances. Will not affect each other.

This is very important. For example, during process communication, different modules may need to register a specific serialization deserialization scheme for the Error object. Use this library to ensure that this Error class can serve multiple modules at the same time.

DEMO
```ts
import { JSONDryFactory } from "json-dry-factory";
const jsonFac = new JSONDryFactory("test1");
const json = jsonFac.stringify({
    a: "QAQ",
    r: /z\d([1-z]+?)/g,
    mix: { '4': 3, o: new Date(), 0: "1" },
    e: new Error('cccc'),
    deep: {
        a: {
            b: {
                x: /44/,
                c: {
                    m: "ccc",
                    s: /cc/
                }
            },
            xx: "432cc1",
            x: 4321,
            bb: /cf/
        }
    }
});
console.log(json);
const obj = jsonFac.parse(json);
console.log('-----------------------');
console.log(obj);
```