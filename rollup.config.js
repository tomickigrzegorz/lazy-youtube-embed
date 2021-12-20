import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import cleanup from 'rollup-plugin-cleanup';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const { PRODUCTION } = process.env;
const input = 'sources/js/index.ts';

export default [
  {
    input,
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      typescript({
        noEmitOnError: false,
      }),
      cleanup(),
    ],
    watch: false,
    output: {
      name: 'ytLazy',
      format: 'iife',
      file: pkg.main,
      sourcemap: true,
    },
  },
  {
    input,
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      typescript({
        noEmitOnError: false,
      }),
      cleanup(),
    ],
    watch: false,
    output: {
      name: 'ytLazy',
      format: 'iife',
      sourcemap: false,
      file: 'dist/js/youtubeLazy.min.js',
      plugins: [terser()],
    },
  },
  {
    input,
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      typescript({
        noEmitOnError: false,
      }),
      cleanup(),
    ],
    output: {
      name: 'ytLazy',
      format: 'iife',
      sourcemap: true,
      file: 'docs/js/youtubeLazy.min.js',
      plugins: [
        terser({
          mangle: true,
        }),
        !PRODUCTION && serve({ open: true, contentBase: ['docs'] }),
        !PRODUCTION && livereload(),
      ],
    },
  },
  {
    input,
    watch: false,
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      typescript({
        noEmitOnError: false,
      }),
      cleanup(),
    ],
    output: [
      {
        name: 'ytLazy',
        format: 'umd',
        sourcemap: true,
        file: 'dist/js/youtubeLazy.umd.js',
      },
      {
        name: 'ytLazy',
        format: 'umd',
        sourcemap: false,
        file: 'dist/js/youtubeLazy.umd.min.js',
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
  {
    input,
    watch: false,
    plugins: [
      babel({ babelHelpers: 'bundled' }),
      typescript({
        noEmitOnError: false,
      }),
      cleanup(),
    ],
    output: [
      {
        name: 'ytLazy',
        format: 'es',
        sourcemap: true,
        file: 'dist/js/youtubeLazy.esm.js',
      },
      {
        name: 'ytLazy',
        format: 'es',
        sourcemap: false,
        file: 'dist/js/youtubeLazy.esm.min.js',
        plugins: [
          terser({
            mangle: true,
            compress: { drop_console: true, drop_debugger: true },
          }),
        ],
      },
    ],
  },
];
