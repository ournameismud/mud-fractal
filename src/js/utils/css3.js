const testElement = document.createElement('div')

const prefix = (function() {
	const styles = window.getComputedStyle(document.documentElement, '')
	const pre = (Array.prototype.slice
		.call(styles)
		.join('')
		.match(/-(moz|webkit|ms)-/) ||
		(styles.OLink === '' && ['', 'o']))[1]
	const dom = 'WebKit|Moz|MS|O'.match(new RegExp('(' + pre + ')', 'i'))[1]
	return {
		dom: dom,
		lowercase: pre,
		css: '-' + pre + '-',
		js: pre[0].toUpperCase() + pre.substr(1)
	}
})()

export default prop => {
	function capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	const prefixed = prefix.css + capitalize(prop)
	const test = [prop, prefixed]
	for (let i = 0; i < test.length; i += 1) {
		if (testElement && testElement.style[test[i]] !== undefined) {
			return test[i]
		}
	}
	return false
}
