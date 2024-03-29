import {
	compile,
	multiCompile,
	fs,
	pathToArtifacts
} from './compile';
import CustomGenerator from './CustomGenerator';
import CustomGeneratorForEmitFile from './CustomGeneratorForEmitFile';

jest.setTimeout(50000);

function findModuleSourceByName(stats, name) {
	if (!stats.modules) {
		return null;
	}

	for (const module of stats.modules) {
		if (module.name === name) {
			return module.source;
		}
	}

	for (const module of stats.modules) {
		const foundModuleSource = findModuleSourceByName(module, name);

		if (foundModuleSource) {
			return foundModuleSource;
		}
	}

	return null;
}

describe('srcset-loader', () => {
	it('should emit files', async () => {
		const stats = await compile('image.js', {
			rules: [{
				match: '(max-width: 3000px)',
				width: [1, 1920, 1280, 720, 560, 320],
				format: ['webp', 'jpg']
			}],
			scalingUp: false
		});
		const source = findModuleSourceByName(stats, './Felix.jpg');
		const commonjsSource = findModuleSourceByName(stats, './Felix.jpg?commonjs');
		const artifacts = fs.readdirSync(pathToArtifacts);

		expect(source.replace(
			/(__webpack_public_path__ \+ ").*(\.\w+")/gi,
			'$1asset$2'
		)).toMatchSnapshot();
		expect(commonjsSource.replace(
			/(__webpack_public_path__ \+ ").*(\.\w+")/gi,
			'$1asset$2'
		)).toMatchSnapshot();
		expect(artifacts.length).toBe(8);
	});

	it('should use custom generator and image url', async () => {
		const stats = await compile('image.js', {
			rules: [{
				width: [320, 64],
				format: ['webp', 'jpg']
			}],
			publicPath: 'https://my.imgproxy.com/',
			generator: CustomGenerator
		});
		const source = findModuleSourceByName(stats, './Felix.jpg');
		const commonjsSource = findModuleSourceByName(stats, './Felix.jpg?commonjs');

		expect(source).toMatchSnapshot();
		expect(commonjsSource).toMatchSnapshot();
	});

	it('should use custom generator and emit file', async () => {
		const stats = await compile('image.js', {
			rules: [{
				width: [320, 64],
				format: ['webp', 'jpg']
			}],
			publicPath: 'https://my.imgproxy.com/',
			generator: CustomGeneratorForEmitFile
		});
		const source = findModuleSourceByName(stats, './Felix.jpg');
		const commonjsSource = findModuleSourceByName(stats, './Felix.jpg?commonjs');

		expect(source).toMatchSnapshot();
		expect(commonjsSource).toMatchSnapshot();
	});

	it('should use custom generator without publicPath and throw an error', async () => {
		await expect(compile('image.js', {
			generator: CustomGenerator
		})).rejects.toThrow('For external mode `publicPath` must be full URL with protocol and hostname');
	});

	it('should use custom generator without full url in publicPath and throw an error', async () => {
		await expect(compile('image.js', {
			publicPath: '/test',
			generator: CustomGenerator
		})).rejects.toThrow('For external mode `publicPath` must be full URL with protocol and hostname');
	});

	it('should use cache with runtimeModulesCache option', async () => {
		// Warm up
		await multiCompile('image.js', {
			rules: [{
				match: '(max-width: 3000px)',
				width: [1, 1920, 1280, 720, 560, 320],
				format: ['webp', 'jpg']
			}],
			scalingUp: false,
			processOnce: false
		});
		await multiCompile('image.js', {
			rules: [{
				match: '(max-width: 3000px)',
				width: [1, 1920, 1280, 720, 560, 320],
				format: ['webp', 'jpg']
			}],
			scalingUp: false,
			processOnce: true
		});

		let stats = null;

		stats = await multiCompile('image.js', {
			rules: [{
				match: '(max-width: 3000px)',
				width: [1, 1920, 1280, 720, 560, 320],
				format: ['webp', 'jpg']
			}],
			scalingUp: false,
			processOnce: true
		});

		const timeWithCache = stats.children.reduce((sum, stats) => sum + stats.time, 0);

		stats = await multiCompile('image.js', {
			rules: [{
				match: '(max-width: 3000px)',
				width: [1, 1920, 1280, 720, 560, 320],
				format: ['webp', 'jpg']
			}],
			scalingUp: false,
			processOnce: false
		});

		const timeWithoutCache = stats.children.reduce((sum, stats) => sum + stats.time, 0);

		expect(timeWithoutCache).toBeGreaterThan(timeWithCache);
	});
});
