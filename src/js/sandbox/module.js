import * as R from 'ramda'

const log = R.curry((name, message) => {
	console.log(name, message)
	return message
})

const item = [
	{
		path: '/'
	},
	{
		path: '/hello/'
	},
	{
		path: '/'
	}
]

R.uniqBy(value => value.path)(item) // ?
