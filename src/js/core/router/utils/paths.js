import pathToRegexp from 'path-to-regexp'
import * as R from 'ramda'
import { matchRoute, parseUrl } from './parseUrl'
import * as str from '@/core/utils/strings'

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

export const flattenRoutes = R.reduce((acc, curr) => {
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

const matches = (routes, url, data) => {
	const { path: slug } = data

	return R.compose(
		R.reverse,
		R.sortBy(R.prop('score')),
		R.map(({ path, pattern, ...rest }) => {
			const last = str.slugFromPath(slug)
			const slugLength = str.segmentize(slug).length
			let score = 1
			let pageNo = null

			if (str.beautifyPath(slug) === str.beautifyPath(path)) {
				score = 5
			} else {
				if (pattern && pathToRegexp(pattern).exec(last)) {
					score = 4
					pageNo = R.compose(parseInt, R.head, R.match(/\d+/g))(last)
				} else if (slugLength === str.segmentize(path).length) {
					score = 3
				}
			}

			return { path, score, pattern, pageNo, params: data, ...rest }
		}),
		R.filter(({ path }) => {
			return matchRoute(path)(str.beautifyPath(slug))
		})
	)(routes)
}

export const findRoute = routes => {
	const routeMap = flattenRoutes(routes)
	return url => {
		const data = parseUrl(url)
		const { isRoot } = data

		if (isRoot) {
			return {
				...R.find(R.propEq('path', '/'))(routes),
				params: data
			}
		}

		const match = R.head(matches(routeMap, url, data))

		if (match) {
			return match
		}

		return {
			...R.find(R.propEq('path', '*'))(routes),
			params: data
		}
	}
}

// const find = findRoute(routes)

// find('https://www.our.com/a/p2?test=hello#terry') // ?
