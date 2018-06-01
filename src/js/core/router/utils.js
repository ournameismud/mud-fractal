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

const exp = `/(\/${name}\/)?(p)+(\d+)/g`

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

export const flattenRoutes = R.reduce(
	(acc, { path, view = {}, children, name = '', options = {} }) => {
		const base = path
		const tmp = []
		tmp.push({ path: path, view, name, options })

		if (children) {
			const items = Array.isArray(children) ? children : [children]

			tmp.push(
				...R.compose(
					R.map(item => ({
						...item,
						path: `${base}/${item.path}`.replace('//', '/')
					})),
					flattenRoutes
				)(items)
			)
		}

		acc.push(...tmp)

		return acc
	},
	[]
)

export const findRoute = R.curry(routes => {
	return R.memoizeWith(R.identity, url => {
		const pNum = url.match(/\d+/g)
		console.log('url', url)
		const data = parseUrl(url)
		console.log(data)
		const { path: slug } = data
		const list = R.filter(({ path }) => matchRoute(path)(slug))(routes)
		const route =
			list.length === 1 && slug !== '/'
				? routes.find(({ path }) => path === '*')
				: list[list.length - 1]

		const { options: { paginationParent } } = route
		const page = pNum
			? parseInt(pNum[pNum.length - 1], 10)
			: paginationParent ? 1 : null

		return {
			route,
			data,
			page
		}
	})
})
// credit: https://github.com/luruke/barba.js/blob/master/src/Pjax/Pjax.js
export const preventClick = (evt, element) => {
	const { href } = element
	if (!element || !href) return false

	//Middle click, cmd click, and ctrl click
	if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
		return

	//Ignore target with _blank target
	if (element.target && element.target === '_blank') return

	//Check if it's the same domain
	if (
		window.location.protocol !== element.protocol ||
		window.location.hostname !== element.hostname
	)
		return

	//Check if the port is the same

	//Ignore case when a hash is being tacked on the current URL
	if (href.indexOf('#') > -1) return

	//Ignore case where there is download attribute
	if (
		element.getAttribute &&
		typeof element.getAttribute('download') === 'string'
	)
		return

	if (element.classList.contains('nope')) return

	return true
}

// `/`	first... is it root
// `/this/bloody/page/`	second is there an exact match
// /(\/blog\/)?(p)+(\d+)/g is there a regex pattern [/blog/p231]
// /page/:id is it a dynamic route
// {*([/[a-z]+[/\/])}?(p)+(\d+)
