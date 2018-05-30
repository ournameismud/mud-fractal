const exampleTransition = {
	onExit: ({ next, from: { route: { path } }, ...rest }) => {
		// console.info('onExit', path, rest)
		next()
	},

	onAfterExit: ({ from: { route: { path } }, ...rest }) => {
		// console.info('onAfterExit', path, rest)
	},

	onEnter: ({ next, to: { route: { path } }, ...rest }) => {
		// console.info('onEnter', path, rest)
		next()
	},

	onAfterEnter: ({ to: { route: { path } }, ...rest }) => {
		// console.info('onAfterEnter', path, rest)
	}
}

let prevHtml
let nextHtml
const paginationExample = {
	updateDom({ wrapper, newHtml, title, from, to }) {
		const { page: fromPageNumber, data: { segments: fromSegments } } = from
		const { page: toPageNumber, data: { segments: toSegments } } = to

		// if we are coming from a pagination page
		if (fromPageNumber === null) {
			// and the previous page is not the new pages parent
			prevHtml = null
			const fromParent =
				toSegments[toSegments.length - 2] ===
				fromSegments[fromSegments.length - 1]

			// empty the wrapper
			if (!fromParent) {
				wrapper.innerHTML = ''
			}
		}

		// if we are going forward
		if (toPageNumber > fromPageNumber) {
			// does the new page we want to insert already exist in the dom
			// this might be the case from POP actions
			// if it does already exist, do nothing and return
			const $newHtmlAlreadyExists = wrapper.querySelector(
				`[data-spon-page="${toPageNumber}"]`
			)
			if ($newHtmlAlreadyExists) return
			// remove the pagination button
			const container = prevHtml ? prevHtml : wrapper
			const $nextBtn = container.querySelector('[data-pagination-next]')

			if ($nextBtn) {
				$nextBtn.style.display = 'none'
			}

			// set the current page number on data-spon-page attribute
			newHtml.setAttribute('data-spon-page', toPageNumber)
			// inject into the dom
			wrapper.appendChild(newHtml)
			// store a reference to the newly inject markup
			prevHtml = newHtml
		} else {
			// Going back... presuming this is via a POP action
			// If we have some previously injectec markup
			// we might want to remove it
			if (prevHtml) {
				// get a reference to the previous node (the page befores markup)
				const tempPrev = prevHtml.previousElementSibling

				// if it exists we should remove it
				if (tempPrev) {
					tempPrev.querySelector('[data-pagination-next]').style.display = ''
					prevHtml.parentNode.removeChild(prevHtml)
				}
				// update the prevHtml to the temp value, could be null
				prevHtml = tempPrev
				// reset the nextHtml
				nextHtml = null

				// if we don't have any previous html
				if (!tempPrev) {
					// empty the wrapper
					wrapper.innerHTML = ''
					// set the current page number on data-spon-page attribute
					newHtml.setAttribute('data-spon-page', toPageNumber)
					// inject into the dom
					wrapper.appendChild(newHtml)
				}
			} else {
				// we have no previous html so we are are trying to inject some

				// set the current page number on data-spon-page attribute
				newHtml.setAttribute('data-spon-page', toPageNumber)
				// get tje nextHTML (i.e. the next pages)
				nextHtml = wrapper.querySelector(this.el)
				// if there is no such thing we can just inject the new markup
				if (!nextHtml) {
					// inject into the dom
					wrapper.appendChild(newHtml)
				} else {
					// we do have 'nextHtml'... inject the nextHtml before the
					// existing chunk
					nextHtml = nextHtml.parentNode.insertBefore(newHtml, nextHtml)
				}
				// reset the prevHtml ref
				prevHtml = null
			}
		}

		// update the title
		document.title = title
	},

	onExit: ({ next }) => {
		next()
	},

	onEnter: ({ next }) => {
		next()
	}
}

export default [
	{
		path: '/',
		view: exampleTransition
	},
	{
		path: '/blog/',
		view: exampleTransition,
		children: {
			path: ':id',
			view: paginationExample,
			pagination: true
		}
	},
	{
		path: '/page-2/',
		view: exampleTransition
	},
	{
		path: '/page-3/',
		view: exampleTransition
	},
	{
		path: '/page-4/',
		view: exampleTransition
	},
	{
		path: '*',
		view: exampleTransition
	}
]
