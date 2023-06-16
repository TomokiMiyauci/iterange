// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { isNumber, isObject } from "./deps.ts";

const enum Msg {
  InvalidRange = "invalid range",
  InvalidStartRange = "start range must be less than infinity",
  InvalidStepRange = "step range must be less than infinity",
}

/** Infinity alias. */
type Infinity = number;

/** Generate numeric sequence lazily.
 *
 * ## Incremental sequence
 *
 * Specify `start` and `end`. By default, `step` is 1 and `end` is exclusive.
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const start = 0;
 * const end = 5;
 *
 * assertEquals([...range(start, end)], [0, 1, 2, 3, 4]);
 * ```
 *
 * ## Decremental sequence
 *
 * If `end` is less than `start`, a decremental sequence is generated.
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const iterator = range(1, -3);
 *
 * assertEquals(iterator.next().value, 1);
 * assertEquals(iterator.next().value, 0);
 * assertEquals(iterator.next().value, -1);
 * ```
 *
 * ## Step
 *
 * You can change the interval(step) of the sequence. The default is `1` (or `1n`
 * for bigint).
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const iterator = range(0, Infinity, 2);
 *
 * assertEquals(iterator.next().value, 0);
 * assertEquals(iterator.next().value, 2);
 * assertEquals(iterator.next().value, 4);
 * ```
 *
 * ## Inclusive end range
 *
 * By default, `end` is exclusive. This can be changed by specifying options.
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertEquals([...range(0, 5, { inclusive: true })], [0, 1, 2, 3, 4, 5]);
 * ```
 *
 * ### Step option
 *
 * Option accepts another `step` field. This is equivalent to [step](#step).
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const iterator = range(0, -Infinity, { step: -2 });
 *
 * assertEquals(iterator.next().value, 0);
 * assertEquals(iterator.next().value, -2);
 * assertEquals(iterator.next().value, -4);
 * ```
 *
 * ## Bigint
 *
 * The range supports `bigint` as well as `number`.
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * const iterator = range(0n, 100n, { step: 10n });
 *
 * assertEquals(iterator.next().value, 0n);
 * assertEquals(iterator.next().value, 10n);
 * assertEquals(iterator.next().value, 20n);
 * ```
 *
 * That is, the following cannot be compiled and are type safe:
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 *
 * //@ts-expect-error
 * range(0, 0n);
 * //@ts-expect-error
 * range(0, 100, 3n);
 * //@ts-expect-error
 * range(1n, Infinity, { step: 1 });
 * ```
 *
 * ## Throwing error
 *
 * Throws `RangeError` in the following cases:
 *
 * - `start`, `end` or `step` is `NaN`
 * - `start` is infinity
 * - if `step` is 0, `start` and `end` are not the same
 *
 * ```ts
 * import { range } from "https://deno.land/x/iterange@$VERSION/range.ts";
 * import { assertThrows } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertThrows(() => range(NaN, 0).next());
 * assertThrows(() => range(0, NaN).next());
 * assertThrows(() => range(0, Infinity, NaN).next());
 * assertThrows(() => range(Infinity, Infinity).next());
 * assertThrows(() => range(0n, 1n, { step: 0n }).next());
 * ```
 */
export function range(
  start: number,
  end: number,
  option?: number | Readonly<NumericRangeOptions<number>>,
): Generator<number, void, unknown>;
export function range(
  start: bigint,
  end: bigint | Infinity,
  option?: bigint | Readonly<NumericRangeOptions<bigint>>,
): Generator<bigint, void, unknown>;
export function* range<T extends number | bigint>(
  start: T,
  end: T,
  option?: T | Readonly<NumericRangeOptions<T>>,
): Generator<bigint | number, void, unknown> {
  if (Number.isNaN(start) || Number.isNaN(end)) {
    throw new RangeError(Msg.InvalidRange);
  }
  if (isInfinity(start)) throw new RangeError(Msg.InvalidStartRange);

  const startIsNumber = isNumber(start);
  const zero = startIsNumber ? 0 : 0n;
  const one = startIsNumber ? 1 : 1n;
  const ifIncrease: boolean = end > start;
  const optionIsObject = isObject(option);
  const inclusiveEnd: boolean = optionIsObject && !!option.inclusive;
  const step: bigint | number = (optionIsObject ? option.step : option) ??
    (ifIncrease ? one : -one);

  if (isInfinity(step)) throw new RangeError(Msg.InvalidStepRange);
  if (Number.isNaN(step) || (step === zero && start !== end)) {
    throw new RangeError(Msg.InvalidRange);
  }

  const ifStepIncrease = step > zero;

  if (ifIncrease !== ifStepIncrease) return;

  // @ts-ignore `+=` operator does not accept `bigint` | `number` operations, but guarantees only one type.
  for (let currentCount = zero;; currentCount += one) {
    // @ts-ignore `*` operator does not accept `bigint` | `number` operations, but guarantees only one type.
    const currentYieldingValue: number | bigint = start + step * currentCount;
    const endCondition = ifIncrease
      ? inclusiveEnd ? currentYieldingValue > end : currentYieldingValue >= end
      : inclusiveEnd
      ? end > currentYieldingValue
      : end >= currentYieldingValue;

    if (endCondition) break;

    yield currentYieldingValue;
  }
}

export interface NumericRangeOptions<T extends bigint | number> {
  /** The stepping interval.
   * @default
   * number: 1
   * bigint: 1n
   */
  step?: T;

  /** Whether the upper bound is exclusive or not.
   * @default false
   */
  inclusive?: boolean;
}

export function isInfinity(input: unknown): boolean {
  return input === Infinity || input === -Infinity;
}
