import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const { PRODUCTION } = process.env;

export default {
  input: 'sources/index.js',
  output: {
    file: 'docs/youtubeLazy.min.js',
    format: 'iife',
    name: 'ytLazy',
    sourcemap: !PRODUCTION
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    PRODUCTION && terser(),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload()
  ]
};