import paginationExample from '@/views/loaders/pagination'

export default [
	{
		path: '/',
		view: {}
	},
	{
		path: '/blog/',
		view: {},
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
				name: 'post',
				view: {
					onEnter({ next }) {
						log('hello bitches')

						next()
					}
				},

				options: {}
			}
		]
	},
	{
		path: '*',
		view: {}
	}
]
