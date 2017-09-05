const baseImgPath = '/dist/images/'

module.exports = {
	selector: 'c-hero',
	status: 'wip',
	title: 'Hero',
	context: {
		title: 'Discover the magnificent Machu Picchu range',
		body: 'Kirsty Holmes bypasses Machu Picchu and heads north to explore pre-Inca ruins, colonial cities and stunning vistas.',
		image: {
			desktop: `${baseImgPath}hero-home-desktop.jpg`,
			tablet: `${baseImgPath}hero-home-tablet.jpg`,
			mobile: `${baseImgPath}hero-home-mobile.jpg`,
			alt: 'Discover the magnificent Machu Picchu range'
		}
	},
	variants: [
		{
			name: 'default'
		},
		{
			name: 'centre',
			context: {
				modifier: 'centre'
			}
		},
		{
			name: 'slide',
			context: {
				modifier: 'slide',
				slides: [
					{
						title: 'Discover the magnificent Machu Picchu range',
						body: 'Kirsty Holmes bypasses Machu Picchu and heads north to explore pre-Inca ruins, colonial cities and stunning vistas.',
						caption: 'Machu Picchu, Peru',
						image: {
							desktop: `${baseImgPath}hero-home-desktop.jpg`,
							tablet: `${baseImgPath}hero-home-tablet.jpg`,
							mobile: `${baseImgPath}hero-home-mobile.jpg`,
							alt: 'Discover the magnificent Machu Picchu range'
						},
						pager: {
							title: 'Latin America',
							theme: 'latin',
							body: 'Discover the maginificent Machu Piccu range'
						}
					},
					{
						title: 'A the magnificent Machu Picchu range',
						body: 'Kirsty Holmes bypasses Machu Picchu and heads north to explore pre-Inca ruins, colonial cities and stunning vistas.',
						caption: 'Machu Picchu, Peru',
						image: {
							desktop: `${baseImgPath}hero-home-desktop.jpg`,
							tablet: `${baseImgPath}hero-home-tablet.jpg`,
							mobile: `${baseImgPath}hero-home-mobile.jpg`,
							alt: 'Discover the magnificent Machu Picchu range'
						},
						pager: {
							title: 'Caribbean',
							theme: 'caribbean',
							body: '5 unusual food experiences in the Caribbean'
						}
					},
					{
						title: 'B the magnificent Machu Picchu range',
						body: 'Kirsty Holmes bypasses Machu Picchu and heads north to explore pre-Inca ruins, colonial cities and stunning vistas.',
						caption: 'Machu Picchu, Peru',
						image: {
							desktop: `${baseImgPath}hero-home-desktop.jpg`,
							tablet: `${baseImgPath}hero-home-tablet.jpg`,
							mobile: `${baseImgPath}hero-home-mobile.jpg`,
							alt: 'Discover the magnificent Machu Picchu range'
						},
						pager: {
							title: 'Asia',
							theme: 'asia',
							body: 'Tawain’s most spectacular hiking routes'
						}
					}
				]
			}
		}
	]
}