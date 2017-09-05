module.exports = {
	context: {
		dev: true,
		entries: [
			{
				template: 'box',
				data: '@box'
			},
			{
				template: 'box',
				data: '@box'
			}
		]
	},
	variants: [
		{
			name: 'intro',
			context: {
				modifier: 'intro'
			}
		}
	]
}