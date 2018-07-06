/**
 * @memberof RouterUtils
 * @typedef {Object} transition
 *
 * @function transition
 *
 * @property {String} el - css selector for the html to inject
 * @property {function} onLoad - function called on the inital load
 * @property {Object} onLoad.props - from/to/dom props
 * @property {function} shouldUnmount - function called before unmounting previous behaviours
 * @property {Object} shouldUnmount.props - from/to/dom props
 * @property {function} shouldMount - function called before mounting next behaviours
 * @property {Object} shouldUnmount.props - from/to/dom props
 * @property {function} onError - called in the event of an error
 * @property {Object} onError.props - from/to/dom props
 * @property {function} updateDom - function used to update the dom
 * @property {Object} updateDom.props - from/to/dom props
 * @property {function} onExit - called when the request has been made
 * @property {Object} onExit.props - from/to/dom props
 * @property {function} onAfterExit - called after the request response
 * @property {Object} onAfterExit.props - from/to/dom props
 * @property {function} onEnter - called when entering the new path
 * @property {Object} onEnter.props - from/to/dom props
 * @property {function} onEnter - called after entering the new path
 * @property {Object} onAfterEnter.props - from/to/dom props
 */

export default {
	el: '.page-child',

	onLoad(props) {
		console.info('onLoad', props) // eslint-disable-line no-console
	},

	shouldUnmount() {
		return true
	},

	shouldMount() {
		return true
	},

	onError: props => {
		console.warn('error loading page', props) // eslint-disable-line no-console
	},

	updateDom({ wrapper, newHtml, title }) {
		wrapper.innerHTML = '' // eslint-disable-line no-param-reassign
		wrapper.appendChild(newHtml)
		document.title = title
	},

	onExit({ next }) {
		// console.table({ from: from.data.path, to: to.data.path, action }) // eslint-disable-line
		next()
	},

	onAfterExit() {},

	onEnter({ next }) {
		next()
	},

	onAfterEnter() {}
}
