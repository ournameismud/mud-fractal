import paginationExample from '@/views/loaders/pagination'

const view = {
	onEnter({ next, ...rest }) {
		log(rest.to.name)
		log(rest.from.name)

		next()
	},

	onLeave({ next, ...rest }) {
		log(rest.to.name)
		log(rest.from.name)

		next()
	}
}

export default [
	{
		path: '/',
		view,
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
		view,
		name: 'blog-listing',
		options: {
			paginationParent: true
		},
		children: [
			{
				path: /(p)+(\d+)/,
				name: 'pagination',
				view: {
					...paginationExample,
					...view
				},
				options: {
					pagination: true
				}
			},
			{
				path: ':id',
				name: 'blog-post',
				view,

				options: {}
			}
		]
	},
	{
		path: '*',
		name: 'default',
		view
	}
]
