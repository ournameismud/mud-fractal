/**
 * Create a router
 * @memberof dom.utils
 *
 * @function getSiblings
 *
 * @param {HTMLELement} node - the target element
 * @param {Function} predicate - the function to be used by filter
 * @return {Array} - an array of sibling elements
 *
 */

export const getSiblings = (node, predicate = item => item !== node) =>
	[...node.parentNode.children].filter(predicate)
