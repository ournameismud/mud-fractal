const baseImgPath = '/dist/images/'

module.exports = {
	selector: '.c-teaser',
	title: 'Teaser',
	status: 'ready',
	context: {
		title: 'Lorem doreum sit dalor gotreym',
		theme: 'latin',
		subheading: 'Stains',
		body: 'A descript about some thing or other',
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
			name: 'default',
			selector: 'c-teaser'
		},
		{
			name: 'box',
			selector: 'c-teaser'
		}
	]
}
