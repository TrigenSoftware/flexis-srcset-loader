import compile from './compile';

compile('image.js', {
	rules: [{
		match:  '(max-width: 3000px)',
		width:  [1, 1920, 1280, 720, 560, 320],
		format: ['webp', 'jpg']
	}],
	scalingUp: false
}, true);
