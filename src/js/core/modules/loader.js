import * as R from 'ramda'

/**
 *
 * @function loader
 *
 * @param :promise -> behaviour => import(`@/behaviours/${behaviour}`)
 *
 * @return :object
 *
 */

export default function loader(fn) {
	const state = {
		stack: [],
		scope: []
	}

	// get all of the data-behaviour props
	// return an array of behaviour objects
	const gatherBehaviours = R.compose(
		R.map(({ node, behaviour }) => {
			return new Promise(resolve => {
				fn(behaviour).then(resp => {
					resolve({
						id: behaviour,
						node,
						behaviour: resp.default
					})
				})
			})
		}),
		R.flatten,
		R.map(node => {
			return R.compose(
				R.map(behaviour => ({
					behaviour,
					node
				})),
				R.split(' '),
				R.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
			)(node.getAttribute('data-behaviour'))
		})
	)

	/**
	 * @public
	 *
	 * Get data behaviours and instantiate
	 *
	 * @function hydrate
	 *
	 * @param :HTMLElement
	 * @param :string - css selector
	 *
	 * @return :object
	 *
	 */
	function hydrate(context, wrapper = '#page-wrapper') {
		return Promise.all(
			gatherBehaviours([...context.querySelectorAll('*[data-behaviour]')])
		).then(data => {
			const stack = R.compose(
				R.map(({ behaviour: Behaviour, node, id }) => {
					const fn = new Behaviour(node, id)
					fn.init()
					setTimeout(() => {
						fn.mount()
					})
					const destroy = node.closest(wrapper)
					return { fn, destroy, id }
				})
			)(data)

			const scope = R.compose(
				//R.filter(({ fn }) => typeof fn === 'function'),
				R.filter(item => item.destroy)
			)(stack)

			Object.assign(state, { stack, scope })

			return state
		})
	}

	/**
	 * @public
	 *
	 * destroy the behaviours
	 *
	 * @function unmount
	 *
	 * @return voide
	 *
	 */
	function unmount() {
		R.compose(
			R.map(({ fn }) => {
				fn.destroy()
			})
		)(state.scope)
	}

	return {
		hydrate,
		unmount
	}
}
