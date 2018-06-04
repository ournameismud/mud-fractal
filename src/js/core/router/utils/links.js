import * as R from 'ramda'
import { segmentize, beautifyPath } from '@/core/utils/strings'
import { parseUrl } from '@/core/router/utils/parseUrl'
import cache from '@/core/router/cache'
/**
 * credit:
 *
 * https://github.com/luruke/barba.js/blob/master/src/Pjax/Pjax.js
 *
 */
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

export const getLinks = R.compose(
	R.filter(
		pathname => pathname !== window.location.pathname && !cache.get(pathname)
	),
	R.map(R.prop('pathname')),
	R.filter(link => !preventClick({}, link.pathname))
)

export const activeLinks = (() => {
	let previous
	let $anchors = []

	const defaultClasses = {
		match: 'is-current',
		root: 'is-current-root',
		parent: 'is-current-parent'
	}

	return ({ scope, classes }) => {
		$anchors = scope

		const classNames = {
			...defaultClasses,
			...classes
		}

		return path => {
			const testSegments = segmentize(path)

			if (previous) {
				R.forEach(({ node, className }) => {
					if (classNames[className]) {
						node.classList.remove(classNames[className])
					}
				})(previous)

				previous = []
			}

			previous = R.compose(
				R.forEach(({ node, className }) => {
					if (classNames[className]) {
						node.classList.add(classNames[className])
					}
				}),
				R.reduce((acc, [, value]) => {
					acc.push(...value)
					return acc
				}, []),
				Object.entries,
				R.map(
					R.compose(
						R.filter(({ segments, matchAgainst }) => {
							return matchAgainst === R.join('/', segments)
						}),
						R.map(node => {
							const { pathname } = node
							const segments = segmentize(pathname)
							const length = R.length(segments)
							const matchAgainst = R.compose(R.join('/'), R.take(length))(
								testSegments
							)
							return {
								node,
								segments,
								matchAgainst,
								className:
									beautifyPath(pathname) === path
										? 'match'
										: length === 1 ? 'root' : 'parent'
							}
						})
					)
				),
				R.groupBy(({ pathname }) => segmentize(pathname).length),
				R.filter(item => {
					const { href } = item
					const { path: pathname } = parseUrl(href)

					const segments = segmentize(pathname)
					return (
						R.head(segments) === R.head(testSegments) &&
						segments.length <= testSegments.length
					)
				})
			)($anchors)
		}
	}
})()
