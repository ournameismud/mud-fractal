import * as R from 'ramda'
import { segmentize, beautifyPath } from '@/core/utils/strings'
import { parseUrl } from './parseUrl'

import local from 'local-links'

/**
 *
 * @memberof RouterUtils
 * @function localLinks
 * @description adds target blank and rel noopener attributes to external links
 * @property {HTMLElement} scope - the element to query from
 * @return {Object}
 *
 */
export const localLinks = scope =>
	[...scope.querySelectorAll('a')]
		.filter(
			a =>
				local.isLocal('click', a, true) === null &&
				a.href !== window.location.href
		)
		.forEach(a => {
			a.setAttribute('target', '_blank')
			a.setAttribute('rel', 'noopener')
		})

/**
 *
 * @memberof RouterUtils
 * @function preventClick
 * @description checks whether a link should be handled by the router
 * @author https://github.com/luruke/barba.js/blob/master/src/Pjax/Pjax.js
 * @property {Object} evt - the event object
 * @property {HTMLElement} element - the anchor being tested
 * @return {Boolean}
 *
 */
export function preventClick(evt, element) {
	if (!element || !element.href) return

	const { href } = element

	// Middle click, cmd click, and ctrl click
	if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
		return

	// Ignore target with _blank target
	if (element.target && element.target === '_blank') return

	// Check if it's the same domain
	if (
		window.location.protocol !== element.protocol ||
		window.location.hostname !== element.hostname
	)
		return

	// Check if the port is the same

	// Ignore case when a hash is being tacked on the current URL
	if (href.indexOf('#') > -1) return

	// Ignore case where there is download attribute
	if (
		element.getAttribute &&
		typeof element.getAttribute('download') === 'string'
	)
		return

	if (element.hasAttribute('data-no-route')) return

	return true
}
/**
 *
 * @memberof RouterUtils
 * @function activeLinks
 * @description add active classes to any active elements
 * @return {function}
 *
 */
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

		return url => {
			const { path, segments: testSegments } = parseUrl(url)

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
						R.filter(
							({ segments, matchAgainst }) =>
								matchAgainst === R.join('/', segments)
						),
						R.map(node => {
							const { href } = node
							const { path: pathname } = parseUrl(href)

							const segments = segmentize(pathname)
							const length = R.length(segments)
							const matchAgainst = R.compose(
								R.join('/'),
								R.take(length)
							)(testSegments)

							return {
								node,
								segments,
								matchAgainst,
								className:
									beautifyPath(pathname) === path
										? 'match'
										: length === 1
											? 'root'
											: 'parent'
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
