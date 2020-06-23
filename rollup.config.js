import {
	external
} from '@trigen/scripts-plugin-rollup/helpers';
import { eslint } from 'rollup-plugin-eslint';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

function getPlugins(transpile = true) {
	return [
		eslint({
			exclude:      ['**/*.json', 'node_modules/**'],
			throwOnError: true
		}),
		commonjs(),
		transpile && babel({
			babelHelpers:       'runtime',
			skipPreflightCheck: true
		})
	].filter(Boolean);
}

export default [{
	input:    'src/index.js',
	plugins:  getPlugins(),
	external: external(pkg, true),
	output:   {
		file:      'lib/index.js',
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}
}, {
	input:    'src/runtime.js',
	plugins:  getPlugins(),
	external: external(pkg, true),
	output:   [{
		file:      'lib/runtime.es.js',
		format:    'es',
		sourcemap: 'inline'
	}, {
		file:      'lib/runtime.js',
		format:    'cjs',
		exports:   'named',
		sourcemap: 'inline'
	}]
}, {
	input:    'src/runtime.js',
	plugins:  getPlugins(false),
	external: external(pkg, true),
	output:   {
		file:      'lib/runtime.babel.js',
		format:    'es',
		sourcemap: 'inline'
	}
}];
