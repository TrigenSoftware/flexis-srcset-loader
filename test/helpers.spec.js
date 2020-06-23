import {
	parseRequestOptions
} from '../src/helpers';

describe('srcset-loader', () => {

	describe('helpers', () => {

		describe('parseRequestOptions', () => {

			it('should parse exports options', () => {

				expect(
					parseRequestOptions('some.jpg?commonjs&width=320&format=jpg')
				).toEqual({
					exports: {
						commonjs: true,
						width:    320,
						format:   'jpg'
					}
				});

				expect(
					parseRequestOptions('some.jpg?width=.5')
				).toEqual({
					exports: {
						width: .5
					}
				});
			});

			it('should parse rule', () => {

				expect(
					parseRequestOptions('some.jpg?{ "width": [1, 0.5], "format": ["jpg", "webp"] }')
				).toEqual({
					rules: [{
						width:  [1, .5],
						format: ['jpg', 'webp']
					}]
				});
			});

			it('should parse exports options and rule', () => {

				expect(
					parseRequestOptions('some.jpg?commonjs&width=320&format=jpg&{ "width": [1, 0.5], "format": ["jpg", "webp"] }')
				).toEqual({
					rules: [{
						width:  [1, .5],
						format: ['jpg', 'webp']
					}],
					exports: {
						commonjs: true,
						width:    320,
						format:   'jpg'
					}
				});
			});
		});
	});
});
