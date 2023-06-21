// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { range } from "./range.ts";
import { assert, describe, it } from "./_dev_deps.ts";

describe("Iterator", () => {
  it("should be exist", async () => {
    Object.defineProperty(globalThis, "Iterator", { value: {} });

    await import("./polyfill.ts");

    assert(Iterator);
    assert(Iterator.range);
    assert(Iterator.range === range);
  });
});
