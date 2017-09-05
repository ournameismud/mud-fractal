module.exports = {
	status: 'wip',
	selector: 'o-btn',
	title: 'Button',

	context: {
		text: 'I am a button'
	},

	variants: [
		{
			name: 'submit',
			status: 'ready',
			context: {
				modifier: 'submit'
			}
		},
		{
			name: 'buy',
			status: 'wip',
			context: {
				modifier: 'buy',
				text: 'Buy from Footprint'
			}
		},
		{
			name: 'amazon',
			status: 'wip',
			context: {
				modifier: 'amazon',
				text: 'Buy from amazon'
			}
		}
	]
}