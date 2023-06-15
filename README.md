# iterange

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/iterange)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/iterange/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/TomokiMiyauci/iterange)](https://github.com/TomokiMiyauci/iterange/releases)
[![codecov](https://codecov.io/github/TomokiMiyauci/iterange/branch/main/graph/badge.svg)](https://codecov.io/gh/TomokiMiyauci/iterange)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/iterange)](https://github.com/TomokiMiyauci/iterange/blob/main/LICENSE)

[![test](https://github.com/TomokiMiyauci/iterange/actions/workflows/test.yaml/badge.svg)](https://github.com/TomokiMiyauci/iterange/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/iterange.png?mini=true)](https://nodei.co/npm/iterange/)

Numeric sequence lazy generator, TC39
[proposal-iterator.range](https://github.com/tc39/proposal-iterator.range)
implementation.

## Entrypoint

This project provides ponyfill and polyfill.

Polyfill has a side effect, so the endpoint is isolated.

The entrypoint of each are as follows:

| Type     | Entrypoint    |
| -------- | ------------- |
| Ponyfill | `mod.ts`      |
| Polyfill | `polyfill.ts` |

## Incremental sequence

Specify `start` and `end`. By default, `step` is 1 and `end` is exclusive.

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const start = 0;
const end = 5;

assertEquals([...range(start, end)], [0, 1, 2, 3, 4]);
```

## Decremental sequence

If `end` is less than `start`, a decremental sequence is generated.

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const iterator = range(1, -3);

assertEquals(iterator.next().value, 1);
assertEquals(iterator.next().value, 0);
assertEquals(iterator.next().value, -1);
```

## Step

You can change the interval(step) of the sequence. The default is `1` (or `1n`
for bigint).

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const iterator = range(0, Infinity, 2);

assertEquals(iterator.next().value, 0);
assertEquals(iterator.next().value, 2);
assertEquals(iterator.next().value, 4);
```

## Inclusive end range

By default, `end` is exclusive. This can be changed by specifying options.

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals([...range(0, 5, { inclusive: true })], [0, 1, 2, 3, 4, 5]);
```

### Step option

Option accepts another `step` field. This is equivalent to [step](#step).

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const iterator = range(0, -Infinity, { step: -2 });

assertEquals(iterator.next().value, 0);
assertEquals(iterator.next().value, -2);
assertEquals(iterator.next().value, -4);
```

## Bigint

The range supports `bigint` as well as `number`.

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const iterator = range(0n, 100n, { step: 10n });

assertEquals(iterator.next().value, 0n);
assertEquals(iterator.next().value, 10n);
assertEquals(iterator.next().value, 20n);
```

That is, the following cannot be compiled and are type safe:

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";

//@ts-expect-error
range(0, 0n);
//@ts-expect-error
range(0, 100, 3n);
//@ts-expect-error
range(1n, Infinity, { step: 1 });
```

## Throwing error

Throws `RangeError` in the following cases:

- `start`, `end` or `step` is `NaN`
- `start` is infinity
- if `step` is 0, `start` and `end` are not the same

```ts
import { range } from "https://deno.land/x/iterange@$VERSION/mod.ts";
import { assertThrows } from "https://deno.land/std/testing/asserts.ts";

assertThrows(() => range(NaN, 0).next());
assertThrows(() => range(0, NaN).next());
assertThrows(() => range(0, Infinity, NaN).next());
assertThrows(() => range(Infinity, Infinity).next());
assertThrows(() => range(0n, 1n, { step: 0n }).next());
```

## Polyfill

Polyfill affects the global object. You must be very careful when using it.

```ts
import "https://deno.land/x/iterange@$VERSION/polyfill.ts";
import { assert } from "https://deno.land/std/testing/asserts.ts";

assert(Iterator);
assert(Iterator.range);
```

## API

See [deno doc](https://deno.land/x/iterange/mod.ts) for all APIs.

## License

Copyright © 2023-present [Tomoki Miyauchi](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license
