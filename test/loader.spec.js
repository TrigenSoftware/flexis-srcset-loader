import compile, {
	fs,
	pathToArtifacts
} from './compile';

jest.setTimeout(50000);

describe('srcset-loader', () => {

	it('should emit files', async () => {

		const stats = await compile('image.js', {
			rules: [{
				match:  '(min-width: 3000px)',
				width:  [1, 3200, 1920, 1280, 720, 560, 320],
				format: ['webp', 'jpg']
			}]
		});
		const {
			source
		} = stats.modules[0].modules[1];
		const artifacts = fs.readdirSync(pathToArtifacts);

		expect(source).toMatchSnapshot();
		expect(artifacts.length).toBe(13);
	});
});
