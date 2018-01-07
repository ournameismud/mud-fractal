const baseImgPath = '/dist/images/'

module.exports = {
	selector: '.c-teaser',
	title: 'Teaser',
	status: 'ready',
	context: {
		title: 'Lorem doreum sit dalor gotreym',
		image: [
			{
				src: `${baseImgPath}teaser.jpg`,
				alt: 'A picture of people enjoying the sunshine',
				width: '346',
				height: '230'
			}
		],
		slug: '#0'
	}
}
