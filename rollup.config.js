import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const { PRODUCTION } = process.env;

const plugins = ({ module }) => {
  return [
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    PRODUCTION && terser({
      module,
      mangle: true,
      compress: true,
    }),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ]
}

const configs = [
  {
    input: 'sources/script.js',
    output: {
      format: 'iife',
      file: pkg.main,
      name: 'ytLazy'
    },
    plugins: plugins({ module: false }),
  },
  {
    input: 'sources/script.js',
    watch: false,
    output: {
      format: 'umd',
      file: pkg.browser,
      name: 'ytLazy'
    },
    plugins: plugins({ module: true }),
  }
];

export default configs;