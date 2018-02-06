import pathToRegexp from 'path-to-regexp'

function parseUri(str) {
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

function pathx(options) {
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
		log('decodeParam error')
	}
}

export const matchRoute = pathx({
	// path-to-regexp options
	sensitive: false,
	strict: false,
	end: false
})

export const parseUrl = href => {
	const { anchor: hash, host, path, query, source } = parseUri(href)

	const segments = path.split('/').filter(p => p.length)
	const slug = segments[segments.length - 1]

	return {
		isRoot: path === '/' ? true : false,
		hash,
		host,
		path,
		query,
		segments,
		slug,
		source,
		length: segments.length
	}
}

export const flattenRoutes = routes =>
	routes.reduce((acc, { path, view, children, name }) => {
		const base = path
		const tmp = []

		tmp.push({ path: path, view: view, name })

		if (children) {
			if (Array.isArray(children)) {
				tmp.push(
					...flattenRoutes(children).map(item => {
						return {
							...item,
							path: base + item.path
						}
					})
				)
			} else {
				const slash = base === '/' ? '' : '/'
				const path = `${base}${slash}${children.path}`
				tmp.push({
					...children,
					path
				})
			}
		}

		acc.push(...tmp)

		return acc
	}, [])

export const findRoute = routes => {
	return url => {
		const parsed = parseUrl(url)
		const slug = parsed.path
		const route = routes.filter(({ path }) => matchRoute(path)(slug))

		if (route.length === 1 && slug !== '/') {
			return {
				route: routes.find(({ path }) => path === '*'),
				data: parsed
			}
		} else {
			return {
				route: route[route.length - 1],
				data: parsed
			}
		}
	}
}

export const navLinks = (
	navigation,
	options = { currentClass: 'active', currentParentClass: 'pappa-active' }
) => {
	const { currentClass, currentParentClass } = options

	const anchors = navigation
		.reduce((acc, selector) => {
			return [...acc, ...document.querySelectorAll(`${selector} a`)]
		}, [])
		.map($anchor => {
			let { href } = $anchor
			const { segments, slug, path } = parseUrl(href)

			return {
				$anchor,
				segments,
				slug,
				path,
				length
			}
		})

	return url => {
		const { path: inputPath, segments: inputSegments, length } = parseUrl(url)

		return anchors
			.filter(({ $anchor, path, segments }) => {
				$anchor.classList.remove(currentClass, currentParentClass)

				const s = inputSegments.slice(0, length - 1)
				const a = segments.find((segment, index) => segment === s[index])
				return path === inputPath || a
			})
			.map(({ $anchor }) => {
				const className =
					$anchor.pathname === inputPath ? currentClass : currentParentClass
				$anchor.classList.add(className)
			})
	}
}
