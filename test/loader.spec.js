import compile, {
	fs,
	pathToArtifacts
} from './compile';

jest.setTimeout(50000);

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
		const {
			source
		} = stats.modules[7].modules[2];
		const {
			source: commonjsSource
		} = stats.modules[0];
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
