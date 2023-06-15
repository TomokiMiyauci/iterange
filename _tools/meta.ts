import { BuildOptions } from "https://deno.land/x/dnt@0.37.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: "both",
  entryPoints: ["./mod.ts", "./polyfill.ts"],
  outDir: "./npm",
  package: {
    name: "iterange",
    version,
    description:
      "Numeric sequence lazy generator, TC39 proposal-iterator.range implementation",
    keywords: [
      "range",
      "iterator",
      "iterable",
      "sequence",
      "numeric",
      "generator",
      "tc39",
      "proposal-iterator.range",
    ],
    license: "MIT",
    homepage: "https://github.com/TomokiMiyauci/iterange",
    repository: {
      type: "git",
      url: "git+https://github.com/TomokiMiyauci/iterange.git",
    },
    bugs: {
      url: "https://github.com/TomokiMiyauci/iterange/issues",
    },
    sideEffects: false,
    type: "module",
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/isx@1.4.0/is_object.ts": {
      name: "@miyauci/isx",
      version: "1.4.0",
      subPath: "is_object.js",
    },
    "https://deno.land/x/isx@1.4.0/is_number.ts": {
      name: "@miyauci/isx",
      version: "1.4.0",
      subPath: "is_number.js",
    },
  },
});
