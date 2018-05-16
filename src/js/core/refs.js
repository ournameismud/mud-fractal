// ({
// 	plugins: 'jsdom-quokka-plugin',
// 	jsdom: {
// 		html: `<div id="test">
//             <b data-element="mod1" data-prop1-th="a" data-prop2="b"></b>
//             <b data-element="mod2" data-prop1-th="a" data-prop2="b"></b>
//             <b data-element="mod3" data-prop1-th="a" data-prop2="b"></b>
//             <b data-element="mod4" data-prop1-th="a" data-prop2="b"></b>
//             <div id="wrapper" data-group="gr1">
// 							<b class="fake" data-behaviour="ModuleB"></b>
// 						</div>
// 					</div>`
// 	}
// })

import * as R from 'ramda'

const sanitizeName = name => name.replace(/-(.)/g, ($0, $1) => $1.toUpperCase())

const removeValueLess = R.filter(({ value }) => value)
const getDataAttributes = R.filter(
	attr => /^data-/.test(attr.name) && attr.name !== 'data-element'
)
const cleanName = R.map(({ name, value }) => ({
	name: sanitizeName(name.substr(5)),
	value
}))
const flattenToObject = R.reduce((acc, { name: key, value }) => {
	acc[key] = value
	return acc
}, {})

const gatherProps = node =>
	R.compose(flattenToObject, cleanName, removeValueLess, getDataAttributes)([
		...node.attributes
	])

const createRefs = R.reduce((acc, node) => {
	acc[`${sanitizeName(node.getAttribute('data-element'))}`] = {
		node: node,
		...gatherProps(node)
	}

	return acc
}, {})

export default root => createRefs([...root.querySelectorAll('*[data-element]')])
