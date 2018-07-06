import * as R from 'ramda'

// Does this need any comments?

const sanitizeName = name => name.replace(/-(.)/g, ($0, $1) => $1.toUpperCase())

const removeValueLess = R.filter(({ value }) => value)

const getDataAttributes = R.filter(
	attr =>
		/^data-/.test(attr.name) &&
		attr.name !== 'data-element' &&
		attr.name !== 'data-behaviour'
)

const cleanName = R.map(({ name, value }) => ({
	name: sanitizeName(name.substr(5)),
	value
}))

const flattenToObject = R.reduce((acc, { name: key, value }) => {
	acc[key] = value
	return acc
}, {})

export const composeProps = R.compose(
	flattenToObject,
	cleanName,
	removeValueLess,
	getDataAttributes
)

const gatherProps = node => composeProps([...node.attributes])

const createRefs = R.reduce((acc, node) => {
	acc[`${sanitizeName(node.getAttribute('data-element'))}`] = {
		node,
		...gatherProps(node)
	}

	return acc
}, {})

export default root => createRefs([...root.querySelectorAll('*[data-element]')])

/**
 * Create a router
 * @memberof Behaviour
 * @mixin RefsMixin
 * @example
 * import ScreenMixin, { mix } from '@/core/ScreenMixin'
 * import {
 * 	RefsMixin,
 * } from '@/core/modules/'
 *
 * export default class ExampleWithAllTheThings extends mix(Behaviour).with(
 * 	RefsMixin
 * ) {
 * 	mount = () => {
 * 		this.$$refs.someElement.node.classList.add('hello')
 * 	}
 * }
 * @return {RefsMixin}
 */
export const RefsMixin = superclass =>
	class extends superclass {
		init() {
			this.$$refs = createRefs([
				...this.$el.querySelectorAll('*[data-element]')
			])
			if (super.init) super.init()
		}
	}
