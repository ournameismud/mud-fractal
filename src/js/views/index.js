import paginationExample from '@/views/loaders/pagination'

export default [
	{
		path: '/',
		view: {},
		name: 'home-page',
		customBodyProp: html => {
			const $hero = html.querySelector('.c-hero')
			if ($hero) {
				return 'hero'
			}
		},
		options: {
			things: 10
		}
	},
	{
		path: '/blog/',
		view: {},
		name: 'blog-listing',
		options: {
			paginationParent: true
		},
		children: [
			{
				path: /(p)+(\d+)/,
				name: 'pagination',
				view: {
					...paginationExample
				},
				options: {
					pagination: true
				}
			},
			{
				path: ':id',
				name: 'blog-post',
				view: {
					onEnter({ next }) {
						next()
					}
				},

				options: {}
			}
		]
	},
	{
		path: '*',
		name: 'default',
		view: {}
	}
]
