import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import cssvariables from 'postcss-css-variables';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";

const { PRODUCTION } = process.env;

export default {
  input: 'sources/index.js',
  output: {
    file: 'docs/youtubeLazy.min.js',
    format: 'iife',
    name: 'ytLazy'
  },
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    terser(),
    postcss({
      extract: 'youtubeLazy.min.css',
      plugins: [
        autoprefixer(),
        cssnano(),
        cssvariables()
      ]
    }),
    copy({
      targets: [
        { src: 'sources/index.html', dest: 'docs/' }
      ]
    }),
    (!PRODUCTION && serve({ open: true, contentBase: 'docs' })),
    (!PRODUCTION && livereload())
  ]
};