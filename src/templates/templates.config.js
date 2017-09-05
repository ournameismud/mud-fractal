const baseImgPath = '/dist/images/'

const article = {
	modifier: 'menu',
	title: 'Going off-grid in southern Bahia, Brazil',
	author: 'Kirsty Holmes',
	image: {
		src: `${baseImgPath}teaser-1.jpg`,
		alt: 'A picture of people enjoying the sunshine',
		width: '346',
		height: '230'
	},
	slug: '#0'
}

const guides = [
	{
		title: 'Latin America',
		theme: 'latin',
		slug: '#0',
		heading: 'Lorem borum turd corum',
		body: 'Blanditiis provident laudantium quo repellendus totam',
		article: article,
		children: [
			{ title: 'Argentina', slug: '#0' },
			{ title: 'Belize', slug: '#0' },
			{ title: 'Bolivia', slug: '#0' },
			{ title: 'Brazil', slug: '#0' },
			{ title: 'Chile', slug: '#0' },
			{ title: 'Colombia', slug: '#0' },
			{ title: 'Costa Rica', slug: '#0' },
			{ title: 'Ecuador & Galapagos', slug: '#0' },
			{ title: 'El Salvador', slug: '#0' },
			{ title: 'Falkland Islands/Islas Malvinas', slug: '#0' },
			{ title: 'Guatemala', slug: '#0' },
			{ title: 'Guyane', slug: '#0' },
			{ title: 'Honduras', slug: '#0' },
			{ title: 'Mexico', slug: '#0' },
			{ title: 'Nicaragua', slug: '#0' },
			{ title: 'Panama', slug: '#0' },
			{ title: 'Paraguay', slug: '#0' },
			{ title: 'Peru', slug: '#0' },
			{ title: 'Suriname', slug: '#0' },
			{ title: 'Uruguay', slug: '#0' },
			{ title: 'Venezuela', slug: '#0' }
		]
	},
	{
		title: 'Caribbean',
		theme: 'caribbean',
		slug: '#0',
		heading: 'Lorem borum turd corum',
		body: 'Blanditiis provident laudantium quo repellendus totam',
		article: article,
		children: [
			{ title: 'Antigua', slug: '#0' },
			{ title: 'Barbados', slug: '#0' },
			{ title: 'Cuba', slug: '#0' },
			{ title: 'Dominica', slug: '#0' },
			{ title: 'Grenada', slug: '#0' },
			{ title: 'Grenadines', slug: '#0' },
			{ title: 'Martinique', slug: '#0' },
			{ title: 'Montserrat', slug: '#0' },
			{ title: 'Nevis', slug: '#0' },
			{ title: 'St Kitts', slug: '#0' },
			{ title: 'St Lucia', slug: '#0' },
			{ title: 'St Vincent', slug: '#0' },
			{ title: 'Tobago', slug: '#0' },
			{ title: 'Trinidad', slug: '#0' }
		]
	},
	{
		title: 'Asia',
		theme: 'asia',
		slug: '#0',
		heading: 'Lorem borum turd corum',
		body: 'Blanditiis provident laudantium quo repellendus totam',
		article: article,
		children: [
			{ title: 'Brunei', slug: '#0' },
			{ title: 'Cambodia', slug: '#0' },
			{ title: 'India', slug: '#0' },
			{ title: 'Laos', slug: '#0' },
			{ title: 'Malaysia', slug: '#0' },
			{ title: 'Nepal', slug: '#0' },
			{ title: 'Sri Lanka', slug: '#0' },
			{ title: 'Thailand', slug: '#0' },
			{ title: 'Vietnam', slug: '#0' }
		]
	},
	{
		title: 'Rest of World',
		theme: 'row',
		slug: '#0',
		heading: 'Lorem borum turd corum',
		body: 'Blanditiis provident laudantium quo repellendus totam',
		article: article,
		children: [
			{ title: 'Iceland', slug: '#0' },
			{ title: 'Italy', slug: '#0' },
			{ title: 'Jordan', slug: '#0' },
			{ title: 'Morocco', slug: '#0' },
			{ title: 'Namibia', slug: '#0' },
			{ title: 'Scotland', slug: '#0' },
			{ title: 'South Africa', slug: '#0' },
			{ title: 'Spain', slug: '#0' },
			{ title: 'Tanzania', slug: '#0' },
			{ title: 'Uganda', slug: '#0' }
		]
	},
]

module.exports = {
	context: {
		globals: {
			newsletter: 'Become a fan of Footprint - be the first to know about new releases, great competitions, unique offers.'
		},

		basket: {
			rows: [
				{
					title: 'Argentina Footprint Travel guide',
					price: '£16.99',
					image: {
						src: '/dist/images/basket-book-1.jpg',
						width: 143,
						height: 80,
						alt: 'Argentina Footprint Travel guide'
					}
				},
				{
					title: 'Peru Footprint Travel guide',
					price: '£16.99',
					image: {
						src: '/dist/images/basket-book-1.jpg',
						width: 143,
						height: 80,
						alt: 'Peru Footprint Travel guide'
					}
				}
			],
			total: '£33.98'
		},


		guides: guides,

		menu: [
			...guides,
			{
				title: 'Where next?',
				slug: '#0'
			},
			{
				title: 'Community',
				slug: '#0'
			},
			{
				title: 'Shop',
				theme: 'shop',
				slug: '#0'
			}
		],

		info: [
			{ title: 'Credits Delivery', slug: '#0' },
			{ title: 'Terms & Conditions', slug: '#0' },
			{ title: 'Site Map', slug: '#0' },
			{ title: 'About us', slug: '#0' },
			{ title: 'Contact us', slug: '#0' }
		]
	}
}