// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import "./polyfill.ts";
import { range } from "./range.ts";
import { assert, describe, it } from "./_dev_deps.ts";

describe("Iterator", () => {
  it("should be exist", () => {
    assert(Iterator);
    assert(Iterator.range);
    assert(Iterator.range === range);
  });
});
