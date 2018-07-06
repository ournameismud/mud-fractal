import pathToRegexp from 'path-to-regexp'
import { segmentize, beautifyPath, slugFromPath } from '@/core/utils/strings'

/**
 * extracts meta data from urls (queries, hash, host, et al)
 * @memberof RouterUtils
 * @function parseUri
 *
 * @property {String} url - the url to parse
 *
 * @return {Object}
 */
export function parseUri(str) {
	const o = parseUri.options
	const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str)
	const uri = {}
	let i = 14

	while (i--) uri[o.key[i]] = m[i] || '' // eslint-disable-line

	uri[o.q.name] = {}
	uri[o.key[12]].replace(o.q.parser, ($0, $1, $2) => {
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

function decodeParam(param) {
	try {
		return decodeURIComponent(param)
	} catch (_) {
		// eslint-disable-next-line no-console
		console.error('decodeParam error')
	}
}

/**
 *
 * @memberof RouterUtils
 * @function createPathObject
 * @property {Object} options - pathToRegexp options
 *
 * @return {Function}
 */
function createPathObject(options = {}) {
	return function(path) {
		const keys = []
		const re = pathToRegexp(path, keys, options)

		return function(pathname, params = {}) {
			const m = re.exec(pathname)
			if (!m) return false
			const output = params

			let key
			let param
			for (let i = 0; i < keys.length; i += 1) {
				key = keys[i]
				param = m[i + 1]
				// eslint-disable-next-line no-continue
				if (!param) continue
				output[key.name] = decodeParam(param)
				if (key.repeat) output[key.name] = params[key.name].split(key.delimiter)
			}

			return output
		}
	}
}

/**
 *
 * @memberof RouterUtils
 * @function matchRoute
 * @return {Function}
 *
 */
export const matchRoute = createPathObject({
	// path-to-regexp options
	sensitive: false,
	strict: false,
	end: false
})

/**
 *
 * @memberof RouterUtils
 * @function parseUrl
 * @property {String} href - the url to parse
 * @return {Object}
 *
 */
export const parseUrl = href => {
	const { anchor: hash, host, path, queryKey, source } = parseUri(href)
	return {
		isRoot: path === '/',
		path: beautifyPath(path),
		raw: path,
		segments: segmentize(path),
		slug: slugFromPath(path),
		hash,
		host,
		source,
		query: queryKey
	}
}
