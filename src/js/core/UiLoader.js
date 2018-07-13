import * as R from 'ramda'
import { gather } from '@/core/modules/loader'
import { camelify } from '@/core/utils/strings'

/**
 * @namespace UI
 * @description lazyload data-ui components
 *
 */
export default (() => {
	const cache = {}
	// using the the gather function from the core loader
	const chunks = component => import(`@/ui/${component}`)
	const loader = gather(chunks, 'data-ui')

	return {
		/**
		 * @memberof UI
		 * @function mount
		 * @description loader data-ui component
		 * @param {HTMLElement} context - the element to querySelectorAll from
		 * @return {Promise}
		 */
		mount(context = document) {
			// this is the same as the core loader (more or less)
			return Promise.all(
				loader([...context.querySelectorAll('*[data-ui]')])
			).then(data => {
				R.forEach(({ behaviour: Behaviour, node }) => {
					let { uiOptions: options, uiKey: key } = node.dataset // eslint-disable-line prefer-const
					if (options) {
						try {
							options = R.compose(
								R.reduce((acc, [key, value]) => {
									acc[camelify(key)] = value

									return acc
								}, {}),
								Object.entries
							)(JSON.parse(options))
						} catch (e) {
							console.error(e) // eslint-disable-line no-console
						}
					}

					const fn = new Behaviour(node, options, key)
					setTimeout(() => {
						fn.mount()
					})

					this.set(key, fn)
				})(data)
			})
		},

		/**
		 * @memberof UI
		 * @function unmount
		 * @description destroy ui components
		 * @return {voide}
		 */
		unmount() {
			R.compose(
				R.reduce((acc, [key, value]) => {
					if (typeof value.unmount === 'function') {
						value.unmount()
					}
					this.remove(key)
					return acc
				}, {}),
				Object.entries
			)(JSON.parse(cache))
		},

		/** *
		 *
		 * @memberof UI
		 * @function set
		 * @example set('terry', value)
		 * @description set an item into the cache
		 * @param {String} set - the name of the key
		 * @param {Any} value - the vaue to store
		 *
		 * @return {void}
		 */
		set(key, value) {
			cache[key] = value
		},

		/** *
		 *
		 * @memberof UI
		 * @function get
		 * @example get('terry')
		 * @description get an item from the cache
		 * @param {String} key - the name of item to get
		 *
		 * @return {Object}
		 */
		get(key) {
			return cache[key]
		},

		/** *
		 *
		 * @memberof UI
		 * @function getStore
		 * @description get the entire cache
		 *
		 * @return {Object}
		 */
		getStore() {
			return cache
		},

		/** *
		 *
		 * @memberof UI
		 * @function remove
		 * @description delete an item from the cache
		 * @param {string} key - remove an item from the cache
		 *
		 * @return {voide}
		 */
		remove(key) {
			delete cache[key]
		}
	}
})()
