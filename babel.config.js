module.exports = {
	exclude: 'node_modules/**',
	presets: [
		['babel-preset-trigen', {
			env:      'lib',
			targets:  require('browserslist-config-trigen/node'),
			commonjs: true
		}]
	],
	overrides: [{
		test: [
			/runtime\.js$/
		],
		presets: [
			['babel-preset-trigen', {
				env:     'lib',
				targets: require('browserslist-config-trigen/browsers'),
				corejs:  false
			}]
		]
	}],
	env: {
		test: {
			presets: [
				['babel-preset-trigen', {
					env: 'jest'
				}]
			]
		}
	}
};
