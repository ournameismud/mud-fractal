import Events from './Events'
import $ from '@/core/dom'

export default class {
	constructor(context = document) {
		this.context = context
		this.$wrapper = '.barba-container'
		this.behaviours = []
		Events.on('INIT:BEHAVIOURS', this.mount)
		Events.on('DESTROY:BEHAVIOURS', this.unmount)
	}

	fetch = (context = document) => {
		return Promise.all(
			[...$('*[data-behaviour]', context)]
				.map(node => {
					node.classList.add('is-loading')
					const behaviours = node.getAttribute('data-behaviour').split(' ')
					return behaviours.map(behaviourName => ({
						behaviourName,
						node: node,
						willDestroy: !!$(node).closest(this.$wrapper).length
					}))
				})
				.reduce((acc, curr) => [...acc, ...curr], [])
				.map(({ node, behaviourName, willDestroy }) => {
					return new Promise((resolve, reject) => {
						import(`@/behaviours/${behaviourName}`)
							.then(resp => {
								node.classList.remove('is-loading')
								return {
									behaviour: resp.default,
									node,
									willDestroy
								}
							})
							.then(resolve)
							.catch(err => {
								console.error(err)
								reject()
							})
					})
				})
		).then(resp => {
			this.behaviours = resp
			return this.behaviours
		})
	}

	/**
	 * Initalize all the behaviours
	 *
	 * @function  mount
	 * @return this
	 */
	mount = (context = document) => {
		this.fetch(context).then(resp => {
			// debugger // eslint-disable-line
			this.behaviours = resp.map(({ node, behaviour: fn, willDestroy }) => {
				const behaviour = new fn(node)
				behaviour.initialize()
				return { behaviour, willDestroy }
			})
		})
	}

	/**
	 * Destroy all the the scoped behaviours and empty the array
	 *
	 * @function  unmount
	 * @return {Loader}
	 */
	unmount = () => {
		// loop over each behaviour and destroy, and empty the array
		this.scoped = this.behaviours
			.filter(({ willDestroy }) => willDestroy)
			.reduce((acc, { behaviour }) => {
				// base destroy, removes event handlers, unmount() called in base
				behaviour.destroy()
				return acc
			}, [])

		return this
	}
}
