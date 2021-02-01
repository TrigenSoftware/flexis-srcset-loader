module.exports = {
	exclude: 'node_modules/**',
	presets: [
		['@trigen/babel-preset', {
			env: 'lib',
			targets: require('@trigen/browserslist-config/node'),
			commonjs: true
		}]
	],
	overrides: [{
		test: [
			/runtime\.js$/
		],
		presets: [
			['@trigen/babel-preset', {
				env: 'lib',
				targets: require('@trigen/browserslist-config/browsers'),
				corejs: false
			}]
		]
	}],
	env: {
		test: {
			presets: [
				['@trigen/babel-preset', {
					env: 'jest'
				}]
			]
		}
	}
};
