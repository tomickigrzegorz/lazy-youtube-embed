import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const { PRODUCTION } = process.env;
const input = "sources/js/index.ts";

const sharedPlugins = (target) => {
  return [
    babel({ babelHelpers: "bundled" }),
    typescript({ noEmitOnError: false, target }),
    cleanup(),
  ];
};

const terserConfig = {
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
};

export default [
  // --------------------------------------------------
  // iife
  {
    input,
    plugins: [...sharedPlugins("es6")],
    watch: false,
    output: {
      file: pkg.main,
      format: "iife",
      name: "ytLazy",
      sourcemap: true,
    },
  },
  {
    input,
    plugins: [...sharedPlugins("es6")],
    watch: false,
    output: {
      file: "dist/js/youtubeLazy.min.js",
      format: "iife",
      name: "ytLazy",
      sourcemap: false,
      plugins: [terser({ ...terserConfig })],
    },
  },
  {
    input,
    plugins: [...sharedPlugins("es6")],
    output: {
      file: "docs/js/youtubeLazy.min.js",
      format: "iife",
      name: "ytLazy",
      sourcemap: true,
      plugins: [
        terser({ ...terserConfig }),
        !PRODUCTION && serve({ open: true, contentBase: ["docs"] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  // --------------------------------------------------
  // umd
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: [
      {
        file: "dist/js/youtubeLazy.umd.js",
        format: "umd",
        name: "ytLazy",
        sourcemap: true,
      },
      {
        file: "dist/js/youtubeLazy.umd.min.js",
        format: "umd",
        name: "ytLazy",
        sourcemap: false,
        plugins: [
          terser({
            ...terserConfig,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  // --------------------------------------------------
  // esm
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es6")],
    output: [
      {
        file: "dist/js/youtubeLazy.esm.js",
        format: "es",
        name: "ytLazy",
        sourcemap: true,
      },
      {
        file: "dist/js/youtubeLazy.esm.min.js",
        format: "es",
        name: "ytLazy",
        sourcemap: false,
        plugins: [
          terser({
            ...terserConfig,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  // --------------------------------------------------
  // ie
  {
    input,
    watch: false,
    plugins: [...sharedPlugins("es5")],
    output: [
      {
        file: "dist/js/youtubeLazy.ie.min.js",
        format: "iife",
        name: "ytLazy",
        sourcemap: false,
        plugins: [
          terser({
            ...terserConfig,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
];
