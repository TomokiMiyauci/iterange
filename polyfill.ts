// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { type NumericRangeOptions, range } from "./range.ts";

type Infinity = number;

declare global {
  // deno-lint-ignore no-var
  var Iterator: {
    range(
      start: number,
      end: number,
      option: number | NumericRangeOptions<number>,
    ): IterableIterator<number>;
    range(
      start: bigint,
      end: bigint | Infinity,
      option: bigint | NumericRangeOptions<bigint>,
    ): IterableIterator<bigint>;
  };
}

if (!("range" in Iterator)) {
  Object.defineProperty(Iterator, "range", { value: range });
}
