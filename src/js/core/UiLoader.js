import * as R from 'ramda'
import { gather } from '@/core/modules/loader'
import { camelify } from '@/core/utils/strings'

export default (() => {
	const cache = {}
	// using the the gather function from the core loader
	const chunks = component => import(`@/ui/${component}`)
	const loader = gather(chunks, 'data-ui')

	return {
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
		 * set('string', value)
		 *		 *
		 * set an item into the cache
		 *
		 * @param {string}
		 * @param {function}
		 *
		 * @return {void}
		 */
		set(key, value) {
			cache[key] = value
		},

		/** *
		 * get('string')
		 *
		 * get an item from the cache
		 *		 *
		 * @param {String}
		 *
		 * @return {function}
		 */
		get(key) {
			return cache[key]
		},

		getStore() {
			return cache
		},

		/** *
		 * remove('string', value)
		 *
		 * delete an item from the cache
		 *
		 * @param {string}
		 *
		 * @return :any
		 */
		remove(key) {
			delete cache[key]
		}
	}
})()
