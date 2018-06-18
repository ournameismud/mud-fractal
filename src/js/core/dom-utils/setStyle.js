import * as R from 'ramda'

const testElement = document.createElement('div')

const prefix = (() => {
	const styles = window.getComputedStyle(document.documentElement, '')
	const pre = ([...styles].join('').match(/-(moz|webkit|ms)-/) ||
		(styles.OLink === '' && ['', 'o']))[1]
	const dom = 'WebKit|Moz|MS|O'.match(new RegExp(`(${  pre  })`, 'i'))[1]

	return {
		dom,
		lowercase: pre,
		css: `-${  pre  }-`,
		js: pre[0].toUpperCase() + pre.substr(1)
	}
})()

const lens = R.over(R.lensIndex(0))

const camelify = R.memoizeWith(R.identity, str => R.compose(
	R.join(''),
	lens(R.toLower),
	R.replace(/[-_\s]+(.)?/g, (match, ch) => (ch ? R.toUpper(ch) : ''))
)(str))

const prop = R.memoizeWith(R.identity, prop => {
	const prefixed = R.compose(
		R.concat(prefix.css),
		R.join(''),
		lens(R.toUpper),
		R.toLower
	)(prop)
	const clear = x => testElement.style[x] !== undefined
	return (
		R.compose(R.head, R.filter(clear), R.map(camelify))([prop, prefixed]) ||
		false
	)
})

export const parseCss = style => Object.entries(style)
	.map(([attr, value]) => ({ attr: prop(attr), value }))
	.map(({ attr, value }) => ({ [attr]: value }))

/**
 *
 * @function setStyle
 *
 * @param :HTMLELement
 * @param :Object
 *
 * @example
 *
 * setStyle(document.getElementById('a), {
 *   transition: 'all 300ms ease',
 * 	 'margin-top': '20px'
 * })
 *
 *
 */
export default (node, styles) => {
	Object.assign(node.style, ...parseCss(styles))

	return node
}
