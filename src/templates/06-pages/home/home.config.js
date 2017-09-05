module.exports = {
	context: {
		hasHero: true,
		label: 'home',
		hero: '@hero--slide',
		teaser: '@teaser',
		featured: '@teaser--lead',
		promo: '@promo--box',
		banner: '@promo',
		intro: [
			{
				template: 'teaser--lead',
				data: '@teaser--lead'
			},
			{
				template: 'promo--box',
				data: '@promo--box'
			}
		],
		sidebar: [
			{
				template: 'popular',
				data: '@popular'
			}
		],
		promos: [
			{
				template: 'promo--box',
				data: '@promo--box'
			},
			{
				template: 'promo--box',
				data: '@promo--box'
			},
		],
		aside: [
			{
				template: 'teaser',
				data: '@teaser'
			},
			{
				template: 'teaser',
				data: '@teaser'
			},
			{
				template: 'teaser',
				data: '@teaser'
			}
		],
		lead: [
			{
				template: 'teaser',
				data: '@teaser'
			},
			{
				template: 'teaser--lead',
				data: '@teaser--lead'
			}
		]
	}
}