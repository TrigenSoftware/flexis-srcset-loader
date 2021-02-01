import compile, {
	fs,
	pathToArtifacts
} from './compile';

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
});
