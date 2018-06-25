import domify from 'domify'

/** *
 * @function insertBefore
 *
 * Insert a dom node before another node
 *
 * @param node/string - the node to insert
 * @param before:HTMLElement - the node to insert before
 *
 * @return :void
 *
 */

export function insertBefore(node, before) {
	const elm = typeof node === 'string' ? domify(node) : node

	return before.parentNode.insertBefore(elm, before)
}

/** *
 * @function insertAfter
 *
 * Insert a dom node before another node
 *
 * @param node/string - the node to insert
 * @param after:HTMLElement - the node to insert after
 *
 * @return :void
 *
 */

export function insertAfter(node, after) {
	const elm = typeof node === 'string' ? domify(node) : node
	return after.parentNode.insertBefore(elm, after.nextSibling)
}
