module.exports = {
	status: 'test',
	label: 'waffle',
	variants: [
		{
			id: 'primary',
			props: {
				classNames: ['waffle--primary']
			},
			scenarios: [
				{
					label: 'Default',
					context: {
						text: 'You have created this component with Komp.'
					}
				}
			]
		}
	]
}
