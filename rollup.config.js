import babel from 'rollup-plugin-babel';
import sass from 'rollup-plugin-sass';
import jsx from 'rollup-plugin-jsx';

import pkg from './package.json';

export default {
  input: 'src/DataListInput.jsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [
    babel({ exclude: 'node_modules/**' }),
    sass({ insert: true }),
    jsx({ factory: 'React.createElement' }),
  ],
  external: ['react', 'react-dom', 'prop-types'],
};
