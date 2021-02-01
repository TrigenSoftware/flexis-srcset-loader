/* eslint-disable no-magic-numbers */
import compile from './compile';

compile('image.js', {
	name: '[contenthash][postfix].[ext]',
	rules: [{
		match: '(max-width: 3000px)',
		width: [1, .5, 1920, 1280, 720, 560, 320],
		format: ['avif', 'webp', 'jpg']
	}],
	scalingUp: false,
	processing: {
		avif: {
			quality: 60
		}
	}
}, true);
