import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const { PRODUCTION } = process.env;
const extensions = ['.ts'];

const plugins = ({ module }) => {
  return [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      plugins: ['@babel/proposal-class-properties'],
      extensions,
    }),
    PRODUCTION &&
      terser({
        module,
        mangle: true,
        compress: true,
      }),
    typescript({
      noEmitOnError: false,
    }),
    !PRODUCTION && serve({ open: true, contentBase: 'docs' }),
    !PRODUCTION && livereload(),
  ];
};

const configs = [
  {
    input: 'sources/script.ts',
    output: {
      format: 'iife',
      file: pkg.main,
      name: 'ytLazy',
    },
    plugins: plugins({ module: false }),
  },
  {
    input: 'sources/script.ts',
    watch: false,
    output: {
      format: 'umd',
      file: pkg.browser,
      name: 'ytLazy',
    },
    plugins: plugins({ module: true }),
  },
];

export default configs;
