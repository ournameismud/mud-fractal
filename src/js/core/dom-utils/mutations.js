import domify from 'domify'

/** *
 * @function insertBefore
 *
 * @description Insert a dom node before another node
 *
 * @property {HTMLElement | String}  node - the node to insert
 * @property {HTMLelement} before - the node to insert before
 *
 * @return {void}
 *
 */

export function insertBefore(node, before) {
	const elm = typeof node === 'string' ? domify(node) : node

	return before.parentNode.insertBefore(elm, before)
}

/** *
 * @function insertAfter
 *
 * @description Insert a dom node before another node
 *
 * @property {HTMLElement | String}  node - the node to insert
 * @property {HTMLelement} before - the node to insert after
 *
 * @return {void}
 *
 */

export function insertAfter(node, after) {
	const elm = typeof node === 'string' ? domify(node) : node
	return after.parentNode.insertBefore(elm, after.nextSibling)
}
