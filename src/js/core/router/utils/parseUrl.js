import pathToRegexp from 'path-to-regexp'

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
