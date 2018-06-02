import pathToRegexp from 'path-to-regexp'
import * as R from 'ramda'

// https://gist.github.com/ir-g/4642307
export function parseUri(str) {
	let o = parseUri.options,
		m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
		uri = {},
		i = 14

	while (i--) uri[o.key[i]] = m[i] || '' // eslint-disable-line

	uri[o.q.name] = {}
	uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2
	})

	return uri
}

parseUri.options = {
	strictMode: false,
	key: [
		'source',
		'protocol',
		'authority',
		'userInfo',
		'user',
		'password',
		'host',
		'port',
		'relative',
		'path',
		'directory',
		'file',
		'query',
		'anchor'
	],
	q: {
		name: 'queryKey',
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
}

function createPathObject(options) {
	options = options || {}

	return function(path) {
		let keys = []
		let re = pathToRegexp(path, keys, options)

		return function(pathname, params) {
			let m = re.exec(pathname)
			if (!m) return false

			params = params || {}

			let key, param
			for (let i = 0; i < keys.length; i += 1) {
				key = keys[i]
				param = m[i + 1]
				if (!param) continue
				params[key.name] = decodeParam(param)
				if (key.repeat) params[key.name] = params[key.name].split(key.delimiter)
			}

			return params
		}
	}
}

function decodeParam(param) {
	try {
		return decodeURIComponent(param)
	} catch (_) {
		console.error('decodeParam error')
	}
}

export const matchRoute = createPathObject({
	// path-to-regexp options
	sensitive: false,
	strict: false,
	end: false
})

export const parseUrl = href => {
	const { anchor: hash, host, path, queryKey, source } = parseUri(href)

	const segments = path.split('/').filter(p => p.length)
	const slug = segments[segments.length - 1]

	return {
		isRoot: path === '/' ? true : false,
		hash,
		host,
		path,
		segments,
		slug,
		source,
		query: queryKey,
		length: segments.length
	}
}

const routes = [
	{
		path: '/a/',
		name: 'test',
		view: {},
		options: {},
		children: [
			{
				path: /(p)+(\d+)/,
				name: 'test',
				view: {},
				options: {}
			},
			{
				path: ':id',
				name: 'test',
				view: {},
				options: {}
			},
			{
				path: '/terry/',
				name: 'test',
				view: {},
				options: {},
				children: {
					path: ':id',
					name: 'test',
					view: {},
					options: {}
				}
			}
		]
	},
	{
		path: '/b/',
		name: 'test',
		view: {},
		options: {},
		children: {
			path: ':id',
			name: 'test',
			view: {},
			options: {}
		}
	},
	{
		path: '/c/',
		name: 'test',
		view: {},
		options: {}
	}
]

const segmentize = R.compose(
	R.filter(R.identity),
	R.split('/'),
	R.replace(/(^\/+|\/+$)/g, '')
)

const beautifyPath = R.compose(R.join('/'), segmentize)
const slugFromPath = R.compose(R.last, segmentize)

const mapChildren = base =>
	R.compose(
		R.flatten,
		R.map(({ children, path, ...rest }) => {
			const container = []
			const tmpPath = path ? beautifyPath(`${base}${path}`) : ':regex'

			container.push({
				path: tmpPath,
				pattern: typeof path === 'string' ? false : path,
				parent: beautifyPath(base),
				...rest
			})

			if (children) {
				const items = Array.isArray(children) ? children : [children]
				container.push(mapChildren(`${base}${path}`)(items))
			}
			return container
		})
	)

const funk = R.reduce((acc, curr) => {
	const { path: tmpPath, children, ...rest } = curr
	let tmp = []

	const path = tmpPath

	tmp.push({ path: beautifyPath(tmpPath), ...rest })

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
			const last = slugFromPath(slug)
			let score = 1

			if (beautifyPath(slug) === beautifyPath(path)) {
				score = 4
			} else {
				if (pattern) {
					if (pathToRegexp(pattern).exec(last)) {
						score = 3
					}
				} else {
					if (segmentize(slug).length === segmentize(path).length) {
						score = 2
					}
				}
			}

			return { path, score, pattern, ...rest }
		}),
		R.filter(({ path }) => {
			return matchRoute(path)(beautifyPath(slug))
		})
	)(routes)
})

const findRoute = R.curry((routes, url) => {
	const routeMap = funk(routes)
	return matches(routeMap, url)
})

findRoute(routes, '/a/p2') // ?
