import { findRoute } from '@/core/router/utils/paths'
import baseTransition from '@/core/router/transition'
import request from '@/core/router/request'
import cache from '@/core/router/cache'
import historyManager from '@/core/router/history'
import eventBus from '@/core/modules/eventBus'
import * as Action from '@/core/router/actions'
import domify from 'domify'

/***
 * native lifecycle
 *
 * @return :object
 */
const lifecycle = (() => {
	/*
		setup to vars to share
	*/
	let matchRoute
	let exitTransition = {}
	let enterTransition = {}
	let wrapper

	return {
		/***
		 *
		 * The routes structure is gonna need a rewrite so...
		 * suject to change...
		 *
		 * at the moment we're returing a functiona storing
		 * it on the matchRoute var
		 *
		 * @function addRoutes
		 * @param :array
		 *
		 * @return :lifecycle
		 */

		addRoutes(routesObject) {
			matchRoute = findRoute(routesObject)
			historyManager.set('from', matchRoute(window.location.pathname))
			return this
		},

		/***
		 *
		 * assign the default wrapper...
		 *
		 * i'm thinking this could be overwritten on a route basis
		 *
		 * @function setWrapper
		 * @param :HTMLElement
		 *
		 * @return :lifecycle
		 */
		setWrapper(node) {
			// assign the node to the wrapper var
			wrapper = node

			return this
		},

		/***
		 *
		 * This function is called once upon load
		 *
		 * @function setWrapper
		 * @param :string -> the pathname yeah: /blog/terry
		 *
		 * @return :lifecycle
		 */
		onLoad(pathname) {
			// get the new route object
			const newState = matchRoute(pathname)

			// combine the transition methods
			const fn = Object.assign({}, baseTransition, newState.view)

			// all the onLoad method
			fn.onLoad(newState)

			// emit this bad boy
			eventBus.emit(Action.ROUTE_TRANSITION_LOAD, newState)

			return this
		},

		/***
		 *
		 * This is the main thing... from/request/to etc... all here
		 *
		 * @function transition
		 * @param :string
		 *
		 * @return :lifecycle
		 */
		transition({ pathname, action, transition: trans, dataAttrs }) {
			// get the new route object
			const newState = matchRoute(pathname)
			// have we been supplice with a transition object... no.. use the route one
			const view = trans ? trans : newState.view

			// update the from history store.... <REWITE></REWITE>
			// historyManager.store.to = newState
			historyManager.set('to', newState)

			const from = historyManager.get('from')
			const to = historyManager.get('to')

			// combine the transition methods for exit... basic + route exits
			exitTransition = Object.assign({}, baseTransition, from.view)

			// combine the transition methods for exit... basic + route enters
			enterTransition = Object.assign({}, baseTransition, view)

			// setup the props to be passed to onExit and onExitComplete
			const exitProps = {
				to,
				from,
				wrapper,
				oldHtml: document.querySelector(exitTransition.el),
				action,
				dataAttrs
			}

			/***
			 *
			 * promise function... does a thing.. returns a transiton promise
			 *
			 * @function promise
			 * @param :string
			 * @param :object
			 * @param :striobjectng
			 *
			 * @return :lifecycle
			 */
			const promise = (method, transition, props = {}) =>
				new Promise((resolve, reject) => {
					transition[method]({
						next: resolve,
						onError: reject,
						...props
					})
				})

			// we have requested exit... emit
			eventBus.emit(Action.ROUTE_TRANSITION_EXIT, exitProps)

			// now... lets do the promise funk
			return (
				Promise.all([
					promise('onExit', exitTransition, exitProps),
					request(pathname)
				])
					// the second request returns a response
					// get it
					// .catch(err => {
					// 	// do we have errors...
					// 	if (err.data && err.ok === false) {
					// 		// emit the error method
					// 		exitTransition.onError({ ...exitProps, ...err })
					// 		// window.location.pathname = pathname
					// 		return false
					// 	}
					// })
					.then(([, resp]) => {
						// more event emiiting
						eventBus.emit(Action.ROUTE_TRANSITION_RESOLVED, exitProps)

						// get the data, assign to markup
						const { data: markup } = cache.get(pathname)

						// console.log(resp)
						// do we have errors...
						if (resp.data && resp.data.ok === false) {
							// emit the error method
							exitTransition.onError({ ...exitProps, ...resp })
							// window.location.pathname = pathname
							return false
						}

						// conver the response html into something we can work with
						const html = domify(markup)

						// get the title, and give it a clean
						const title = html.querySelector('title').textContent.trim()

						// query the new newHtml for the selector defined on
						// this object... default = '.page-child'
						const newHtml = html.querySelector(enterTransition.el)

						// props object passed to each after method
						const props = {
							oldHtml: document.querySelector(exitTransition.el),
							wrapper,
							newHtml,
							title,
							html,
							to,
							from,
							action
						}

						// check... do we want to unmount the previous html
						const shouldUnmount = enterTransition.shouldUnmount(props)
						const shouldMount = enterTransition.shouldUnmount(props)

						// if we do... sure... unmount event
						shouldUnmount &&
							eventBus.emit(Action.ROUTE_TRANSITION_BEFORE_DOM_UPDATE, props)

						// update the dom method
						enterTransition.updateDom(props)

						// emit update event
						shouldMount &&
							eventBus.emit(Action.ROUTE_TRANSITION_AFTER_DOM_UPDATE, props)

						// no proms here.. just call this method
						exitTransition.onAfterExit(props)

						// return that props object we made earlier
						return props
					})
					.then(props => {
						// we have props...
						// it's possible we don't, we could have bailed early
						if (props) {
							// enter props
							const enterProps = {
								...props,
								action
							}

							// emit some more
							eventBus.emit(Action.ROUTE_TRANSITION_ENTER, enterProps)

							// cycle through the enter methods
							promise('onEnter', enterTransition, enterProps).then(() => {
								enterTransition.onAfterEnter(enterProps)

								historyManager.set('from', newState)
								eventBus.emit(Action.ROUTE_TRANSITION_COMPLETE, enterProps)
							})
						}

						return props
					})
			)
		}
	}
})()

export default lifecycle
