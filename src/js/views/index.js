import { Home } from './Home'
import { Fallback } from './Fallback'

export default [
	{
		path: '/',
		view: Home
	},
	{
		path: '*',
		view: Fallback
	}
]
