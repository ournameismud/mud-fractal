({
	plugins: 'jsdom-quokka-plugin',
	jsdom: {
		html: `<div id="test">
            <b data-element="mod1" data-prop1-th="a" data-prop2="b"></b>
            <b data-element="mod2" data-prop1-th="a" data-prop2="b"></b>
            <b data-element="mod3" data-prop1-th="a" data-prop2="b"></b>
            <b data-element="mod4" data-prop1-th="a" data-prop2="b"></b>
            <div id="wrapper" data-group="gr1">
							<b class="fake" data-behaviour="ModuleB"></b>
						</div>
					</div>`
	}
})

import * as R from 'ramda'

const sanitizeName = name => name.replace(/-(.)/g, ($0, $1) => $1.toUpperCase())

const gatherProps = node =>
	R.compose(
		R.reduce((acc, { name: key, value }) => {
			acc[key] = value
			return acc
		}, {}),
		R.map(({ name, value }) => ({
			name: sanitizeName(name.substr(5)),
			value
		})),
		R.filter(attr => /^data-/.test(attr.name) && attr.name !== 'data-element')
	)([...node.attributes])

const createRefs = R.map(node => ({
	[`${sanitizeName(node.getAttribute('data-element'))}`]: {
		node: node,
		...gatherProps(node)
	}
}))

export default root => createRefs([...root.querySelectorAll('*[data-element]')])
