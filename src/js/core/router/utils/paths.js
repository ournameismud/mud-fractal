import pathToRegexp from 'path-to-regexp'
import * as R from 'ramda'
import * as str from '@/core/utils/strings'
import { matchRoute, parseUrl } from './parseUrl'

/**
 * recursively loop over any route children
 * returns a functions that expects an array of routes
 *
 * @function mapChildren
 *
 * @param {String}
 *
 * @return {Function}
 */
function mapChildren(base) {
	return R.compose(
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
}

/**
 * flattens the routes into a single flat array
 *
 * @function flattenRoutes
 *
 * @param {Array}
 *
 * @return {Array}
 */

export const flattenRoutes = R.reduce((acc, curr) => {
	const { path: tmpPath, children, ...rest } = curr
	const tmp = []

	const path = tmpPath

	tmp.push({ path: str.beautifyPath(tmpPath), ...rest })

	if (children) {
		const items = Array.isArray(children) ? children : [children]
		tmp.push(...mapChildren(path)(items))
	}

	acc.push(...tmp)

	return acc
}, [])

/**
 * finds all the route matches
 * gives each match a score
 *
 * @function matches
 *
 * @param {Array}
 * @param {String}
 * @param {Object}
 *
 * @return {Object}
 */
const matches = (routes, data) => {
	const { path: slug } = data

	return R.compose(
		R.reverse,
		R.sortBy(R.prop('score')),
		R.map(({ path, pattern, ...rest }) => {
			const last = str.slugFromPath(slug)
			const slugLength = str.segmentize(slug).length
			const pathLength = str.segmentize(path).length
			let score = 1
			let pageNo = null

			// exact match?
			if (str.beautifyPath(slug) === path) {
				score = 5
			} else {
				// pattern, and the last segment matches the regexp
				if (pattern && pathToRegexp(pattern).exec(last)) {
					score = 4
					// get the page number
					pageNo = R.compose(parseInt, R.head, R.match(/\d+/g))(last)
				} else if (slugLength === pathLength) {
					score = 3
				}
			}

			return { route: path, score, pattern, pageNo, params: data, ...rest }
		}),
		R.filter(({ path }) => matchRoute(path)(str.beautifyPath(slug)))
	)(routes)
}

export const findRoute = routes => {
	const routeMap = flattenRoutes(routes)
	return url => {
		const data = parseUrl(url)
		const { isRoot } = data

		if (isRoot) {
			const { path: route, ...rest } = R.find(R.propEq('path', '/'))(routes)

			return {
				route,
				...rest,
				params: data
			}
		}

		const match = R.head(matches(routeMap, data))

		if (match) {
			return match
		}

		const { path: route, ...rest } = R.find(R.propEq('path', '*'))(routes)

		return {
			route,
			...rest,
			params: data
		}
	}
}

// const find = findRoute(routes)

// find('https://www.our.com/a/p2?test=hello#terry') // ?
