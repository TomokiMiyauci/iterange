// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.

import { range } from "./range.ts";
import { assertEquals, assertThrows, describe, it } from "./_dev_deps.ts";

describe("range", () => {
  describe("range with number", () => {
    it("should yield number what incremented by 1", () => {
      assertEquals([...range(-1, 5)], [-1, 0, 1, 2, 3, 4]);
    });

    it("should yield number what incremented by specifier step", () => {
      assertEquals([...range(0, 10, 2)], [0, 2, 4, 6, 8]);
    });

    it("should yield number what incremented and specifier option.step", () => {
      assertEquals([...range(0, 10, { step: 2 })], [0, 2, 4, 6, 8]);
    });

    it("should yield number what incremented and inclusive", () => {
      assertEquals([...range(0, 5, { inclusive: true })], [0, 1, 2, 3, 4, 5]);
    });

    it("should not yield anything if the range start and end is same", () => {
      assertEquals([...range(1, 1)], []);
    });

    it("should not yield anything if the step is less than start", () => {
      assertEquals([...range(0, 5, -1)], []);
    });

    it("should not yield anything if the step is out of range", () => {
      assertEquals([...range(0, -5, 1)], []);
    });

    it("should yield number what decremented by 1", () => {
      assertEquals([...range(5, -1)], [5, 4, 3, 2, 1, 0]);
    });

    it("should yield if same start-end range and inclusive", () => {
      assertEquals([...range(0, 0, { inclusive: true })], [0]);
    });
  });

  describe("range with bigint", () => {
    it("should yield bigint what incremented by 1n", () => {
      assertEquals([...range(-1n, 5n)], [-1n, 0n, 1n, 2n, 3n, 4n]);
    });

    it("should yield bigint what incremented by specifier step", () => {
      assertEquals([...range(0n, 10n, 2n)], [0n, 2n, 4n, 6n, 8n]);
    });

    it("should yield bigint what incremented and specifier option.step", () => {
      assertEquals([...range(0n, 10n, { step: 2n })], [0n, 2n, 4n, 6n, 8n]);
    });

    it("should yield bigint what incremented and inclusive", () => {
      assertEquals([...range(0n, 5n, { inclusive: true })], [
        0n,
        1n,
        2n,
        3n,
        4n,
        5n,
      ]);
    });

    it("should not yield anything if the range start and end is same", () => {
      assertEquals([...range(1n, 1n)], []);
    });

    it("should not yield anything if the step is less than start", () => {
      assertEquals([...range(0n, 5n, -1n)], []);
    });

    it("should not yield anything if the step is out of range", () => {
      assertEquals([...range(0n, -5n, 1n)], []);
    });

    it("should yield bigint what decremented by 1n", () => {
      assertEquals([...range(5n, -1n)], [5n, 4n, 3n, 2n, 1n, 0n]);
    });

    it("should yield if same start-end range and inclusive", () => {
      assertEquals([...range(0n, 0n, { inclusive: true })], [0n]);
    });
  });

  it("should work with infinity", () => {
    const iter = range(0, Infinity);

    assertEquals(iter.next().value, 0);
    assertEquals(iter.next().value, 1);
    assertEquals(iter.next().value, 2);
    assertEquals(iter.next().value, 3);
  });

  describe("throwing error", () => {
    it("should throw error if the range include NaN", () => {
      assertThrows(() => range(NaN, 0).next());
      assertThrows(() => range(0, NaN).next());
      assertThrows(() => range(NaN, NaN).next());
      assertThrows(() => range(0, 0, NaN).next());
      assertThrows(() => range(0, 0, { step: NaN }).next());
      assertThrows(() => range(0, 1, { step: 0 }).next());
    });

    it("should throw error if the start or step is Infinity", () => {
      assertThrows(() => range(Infinity, 1).next());
      assertThrows(() => range(-Infinity, 1).next());
      assertThrows(() => range(0, 1, Infinity).next());
      assertThrows(() => range(0, 1, -Infinity).next());
      assertThrows(() => range(0, 1, { step: Infinity }).next());
      assertThrows(() => range(0, 1, { step: -Infinity }).next());
    });

    it("should type error if the all argument type is not same", () => {
      //@ts-expect-error end should be number
      range(0, 1n);

      //@ts-expect-error step should be number
      range(0, 100, 3n);
      //@ts-expect-error end and step should be bigint
      range(1n, Infinity, { step: 1 });
    });
  });
});
