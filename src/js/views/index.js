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
		children: {
			path: ':id',
			view: paginationExample,
			options: {
				pagination: true
			}
		}
	},
	{
		path: '*',
		view: {}
	}
]
