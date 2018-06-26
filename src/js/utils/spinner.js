import domify from 'domify'
import setStyle from '@/core/dom-utils/setStyle'
import eventPromise from './eventPromise'
import animationEnd from './animationEnd'

export default (() => {
	let html

	let parent

	return {
		inject(target, style = {}) {
			html = domify(
				'<svg class="o-spinner" width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle class="o-spinner__path" fill="none" stroke-width="6" stroke-linecap="round" cx="20" cy="20" r="15"></circle></svg>'
			)
			setStyle(html, style)
			parent = target
			target.appendChild(html)
		},

		remove() {
			if (parent) {
				return eventPromise(animationEnd('transition'), html, () => {
					setStyle(html, {
						opacity: 0
					})
				}).then(() => {
					html.parentNode.removeChild(html)
				})
			}
		}
	}
})()
