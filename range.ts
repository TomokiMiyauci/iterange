// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { isNumber, isObject } from "./deps.ts";

const enum Msg {
  InvalidRange = "invalid range",
  InvalidStartRange = "start range must be less than infinity",
  InvalidStepRange = "step range must be less than infinity",
}

/** Generate range numeric lazily. */
export function range(
  start: number,
  end: number,
  option?: number | Readonly<NumericRangeOptions<number>>,
): Generator<number, void, unknown>;
export function range(
  start: bigint,
  end: bigint,
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
  step?: T;
  inclusive?: boolean;
}

export function isInfinity(input: unknown): boolean {
  return input === Infinity || input === -Infinity;
}
