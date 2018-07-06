import * as R from 'ramda'

/**
 * @namespace loader
 */

/**
 * @memberof loader
 * @description Get data behaviours and instantiate
 * @function gather
 * @property {Promise} fn - The dynamic import function
 * @property {String} attr - The data attribute used to select behaviours
 *
 * @return {Promise}
 *
 */
export const gather = (fn, attr = 'data-behaviour') =>
	R.compose(
		R.map(
			({ node, behaviour }) =>
				new Promise(resolve => {
					fn(behaviour).then(resp => {
						resolve({
							id: behaviour,
							node,
							behaviour: resp.default
						})
					})
				})
		),
		R.flatten,
		R.map(node =>
			R.compose(
				R.map(behaviour => ({
					behaviour,
					node
				})),
				R.split(' '),
				R.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
			)(node.getAttribute(attr))
		)
	)

/**
 * @memberof loader
 * @function loader
 * @param {Promise} fn - 
 * @example
 * 
 * loader(import(`@/behaviours/${behaviour}`))
 *
 * @return {Object}
 *
 */
export default function loader(fn) {
	const state = {
		stack: [],
		scope: []
	}

	const gatherBehaviours = gather(fn, 'data-behaviour')

	/**
	 * @memberof loader
	 * @description Get data behaviours and instantiate
	 * @function hydrate
	 * @property {HTMLElement} context - the selector to query from
	 * @property {String} wrapper - css selector, used to work out if an element should be destroyed
	 *
	 * @return {Promise}
	 *
	 */
	function hydrate(context, wrapper = '#page-wrapper') {
		return Promise.all(
			gatherBehaviours([...context.querySelectorAll('*[data-behaviour]')])
		).then(data => {
			const stack = R.map(({ behaviour: Behaviour, node, id }) => {
				const fn = new Behaviour(node, id)
				fn.init()
				setTimeout(() => {
					fn.mount()
				})
				const destroy = node.closest(wrapper)
				return { fn, destroy, id }
			})(data)

			const scope = R.compose(
				// R.filter(({ fn }) => typeof fn === 'function'),
				R.filter(item => item.destroy)
			)(stack)

			Object.assign(state, { stack, scope })

			return state
		})
	}

	/**
	 * @memberof loader
	 * @description Unmount the scoped behaviours
	 * @function unmount
	 * @return {void}
	 */
	function unmount() {
		R.compose(
			R.forEach(({ fn }) => {
				fn.destroy()
			})
		)(state.scope)
	}

	return {
		hydrate,
		unmount
	}
}
