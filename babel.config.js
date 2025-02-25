module.exports = function (api) {
	api.cache(true)

	const presets = [
		[
			'@babel/preset-env',
			{
				targets: {
					node: true
				}
			}
		]
	]
	const plugins = [
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-syntax-dynamic-import',
		[
			'@babel/plugin-proposal-pipeline-operator',
			{
				proposal: 'smart'
			}
		],
		'@babel/plugin-proposal-optional-catch-binding'
	]

	return {
		presets,
		plugins
	}
}
