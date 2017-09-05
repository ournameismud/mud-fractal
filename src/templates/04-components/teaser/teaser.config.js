const baseImgPath = '/dist/images/'

module.exports = {
	selector: 'c-teaser',
	title: 'Teaser',
	status: 'wip',
	context: {
		title: 'Going off-grid in southern Bahia, Brazil',
		theme: 'latin',
		subheading: 'Latin America',
		body: 'The unspoilt nature, rich cultural heritage, diverse traditions and rituals, unique ancient architecture, cuisine and wine',
		author: 'Kirsty Holmes',
		image: {
			src: `${baseImgPath}teaser-1.jpg`,
			alt: 'A picture of people enjoying the sunshine',
			width: '346',
			height: '230'
		},
		slug: '#0'
	},

	variants: [
		{
			name: 'default'
		},
		{
			name: 'box',
			context: {
				modifier: 'box'
			}
		},
		{
			name: 'menu',
			context: {
				modifier: 'menu',
				image: {
					src: `${baseImgPath}teaser-menu-1.jpg`,
					alt: 'A picture of people enjoying the sunshine',
					width: '265',
					height: '177'
				},
			}
		},
		{
			name: 'lead',
			context: {
				modifier: 'lead',
				image: {
					src: `${baseImgPath}teaser-lead-1.jpg`,
					alt: 'A picture of people enjoying the sunshine',
					width: '511',
					height: '336'
				},
			}
		}
	]
}