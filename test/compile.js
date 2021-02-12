import path from 'path';
import webpack from 'webpack';
import {
	fs
} from 'memfs';

export {
	fs
};
export const pathToArtifacts = path.resolve(__dirname, 'artifacts');

function createConfig(fixtureEntry, outputFilename = 'bundle.js', options = {}) {
	return {
		optimization: {
			minimize: false
		},
		context: __dirname,
		entry: `./${fixtureEntry}`,
		output: {
			path: pathToArtifacts,
			filename: outputFilename
		},
		module: {
			rules: [{
				test: /\.jpe?g$/,
				use: {
					loader: path.resolve(__dirname, '../src/index.js'),
					options
				}
			}, {
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}]
		}
	};
}

export function compile(fixtureEntry, options = {}, writeToFs = false) {
	const webpackCompiler = webpack(createConfig(fixtureEntry, 'bundle.js', options));

	if (!writeToFs) {
		webpackCompiler.outputFileSystem = fs;
	}

	return new Promise((resolve, reject) => {
		webpackCompiler.run((err, stats) => {
			const hasErrors = stats && stats.hasErrors();

			if (err || hasErrors) {
				reject(hasErrors
					? new Error(stats.toJson().errors[0])
					: err);
				return;
			}

			resolve(stats.toJson({
				source: true
			}));
		});
	});
}

export function multiCompile(
	fixtureEntry,
	options = {},
	writeToFs = false
) {
	const webpackCompiler = webpack([
		createConfig(fixtureEntry, 'emit-bundle.js', options),
		createConfig(fixtureEntry, 'noemit-bundle.js', options)
	]);

	if (!writeToFs) {
		webpackCompiler.outputFileSystem = fs;
	}

	return new Promise((resolve, reject) => {
		webpackCompiler.run((err, stats) => {
			const hasErrors = stats && stats.hasErrors();

			if (err || hasErrors) {
				reject(hasErrors
					? new Error(stats.toJson().errors[0])
					: err);
				return;
			}

			resolve(stats.toJson({
				source: true
			}));
		});
	});
}
