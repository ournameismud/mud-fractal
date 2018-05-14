;({
	plugins: 'jsdom-quokka-plugin',
	jsdom: {
		html: `<div id="test">
            <b data-behaviour="ModuleA"></b>
            <div id="wrapper">
							<b class="fake" data-behaviour="ModuleB"></b>
						</div>
					</div>`
	}
})

import * as R from 'ramda'
// import mitt from 'mitt'

const log = (...message) => console.log(...message) // eslint-disable-line

const loader = (plugins, path = '../behaviours/') => {
	const state = {
		stack: [],
		scope: []
	}

	const PATH = path

	const gatherBehaviours = R.compose(
		R.map(({ node, behaviour }) => {
			return new Promise(resolve => {
				import(`${PATH}${behaviour}`).then(resp => {
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
					behaviour, // replace with
					node
				})),
				R.split(' '),
				R.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
			)(node.getAttribute('data-behaviour'))
		})
	)

	const hydrate = context => {
		return Promise.all(
			gatherBehaviours([...context.querySelectorAll('*[data-behaviour]')])
		).then(data => {
			const stack = R.compose(
				R.map(({ behaviour, node, id }) => {
					const fn = behaviour(node, plugins)
					const destroy = node.classList.contains('fake')
					return { fn, destroy, id }
				})
			)(data)

			const scope = R.compose(
				R.filter(({ fn }) => typeof fn === 'function'),
				R.filter(item => item.destroy)
			)(stack)

			Object.assign(state, { stack, scope })

			return state
		})
	}

	const unmount = () => {
		R.compose(R.map(item => item()))(state.scope)
	}

	return {
		hydrate,
		unmount
	}
}

export default loader
