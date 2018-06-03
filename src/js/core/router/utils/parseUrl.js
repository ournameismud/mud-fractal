import pathToRegexp from 'path-to-regexp'
import { segmentize, beautifyPath, slugFromPath } from '@/core/utils/strings'
/**
 * extracts meta data from urls (queries, hash, host, et al)
 *
 * @function parseUri
 *
 * @param :string url
 *
 * @return :object
 */
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

/**
 *
 * @function createPathObject
 *
 * @param :object pathToRegexp options
 *
 * @return :function
 */
function createPathObject(options) {
	options = options || {}

	/**
	 *
	 * @param :string the test path
	 *
	 * @return :function
	 */
	return function(path) {
		let keys = []
		let re = pathToRegexp(path, keys, options)

		/**
		 * @param :string // the url you want to match
		 * @param :object
		 *
		 * @return :object / :boolean
		 */
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

/**
 *
 * @function matchRoute
 *
 * @return :function
 */
export const matchRoute = createPathObject({
	// path-to-regexp options
	sensitive: false,
	strict: false,
	end: false
})

/**
 *
 * @function parseUrl
 *
 * @param :string url...
 *
 * @return :object
 */
export const parseUrl = href => {
	const { anchor: hash, host, path, queryKey, source } = parseUri(href)

	return {
		isRoot: path === '/' ? true : false,
		path: beautifyPath(path),
		segments: segmentize(path),
		slug: slugFromPath(path),
		hash,
		host,
		source,
		query: queryKey
	}
}
