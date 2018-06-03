import pathToRegexp from 'path-to-regexp'
import * as R from 'ramda'
import { matchRoute, parseUrl } from './parseUrl'
import * as str from '@/core/utils/strings'

// https://gist.github.com/ir-g/4642307

const routes = [
	{
		path: '/a/',
		name: 'a',
		view: {},
		options: {},
		children: [
			{
				path: /(p)+(\d+)/,
				name: 'pagination',
				view: {},
				options: {}
			},
			{
				path: ':id',
				name: 'id',
				view: {},
				options: {}
			},
			{
				path: '/terry/',
				name: 'terry',
				view: {},
				options: {},
				children: {
					path: ':id',
					name: 'terry:id',
					view: {},
					options: {}
				}
			}
		]
	},
	{
		path: '/b/',
		name: 'b-test',
		view: {},
		options: {},
		children: {
			path: ':id',
			name: 'b-test:id',
			view: {},
			options: {}
		}
	},
	{
		path: '/c/',
		name: 'c-test',
		view: {},
		options: {}
	}
]

const mapChildren = base =>
	R.compose(
		R.flatten,
		R.map(({ children, path, ...rest }) => {
			const container = []
			const tmpPath = path ? str.beautifyPath(`${base}${path}`) : ':regex'

			container.push({
				path: tmpPath,
				pattern: typeof path === 'string' ? false : path,
				parent: str.beautifyPath(base),
				...rest
			})

			if (children) {
				const items = Array.isArray(children) ? children : [children]
				container.push(mapChildren(`${base}${path}`)(items))
			}
			return container
		})
	)

const flattenRoutes = R.reduce((acc, curr) => {
	const { path: tmpPath, children, ...rest } = curr
	let tmp = []

	const path = tmpPath

	tmp.push({ path: str.beautifyPath(tmpPath), ...rest })

	if (children) {
		const items = Array.isArray(children) ? children : [children]
		tmp.push(...mapChildren(path)(items))
	}

	acc.push(...tmp)

	return acc
}, [])

const log = R.curry((name, value) => {
	return value
})

const matches = R.curry((routes, url) => {
	const data = parseUrl(url)
	const { path: slug } = data

	return R.compose(
		R.reverse,
		R.sortBy(R.prop('score')),
		R.map(({ path, pattern, ...rest }) => {
			const last = str.slugFromPath(slug)
			const slugLength = str.segmentize(slug).length
			let score = 1

			if (str.beautifyPath(slug) === str.beautifyPath(path)) {
				score = 5
			} else {
				if (pattern) {
					if (pathToRegexp(pattern).exec(last)) {
						score = 4
					}
				} else if (slugLength === str.segmentize(path).length) {
					score = 3
				}
			}

			return { path, score, pattern, ...rest }
		}),
		R.filter(({ path }) => {
			return matchRoute(path)(str.beautifyPath(slug))
		})
	)(routes)
})

flattenRoutes(routes)

const findRoute = R.curry((routes, url) => {
	const routeMap = flattenRoutes(routes)
	return matches(routeMap, url)
})

const find = findRoute(routes)

find('/a/terry/') // ?
