import compile from './compile';

compile('image.js', {
	rules: [{
		match:  '(min-width: 3000px)',
		width:  [1, 3200, 1920, 1280, 720, 560, 320],
		format: ['webp', 'jpg']
	}]
}, true);
