let prevHtml
let nextHtml

const toggleBtnState = (wrapper, type, display) => {
	const $btn = wrapper.querySelector(`[data-pagination-${type}]`)
	if ($btn) {
		$btn.style.display = display
	}
}

const paginationExample = {
	updateDom({ wrapper, newHtml, title, from, to }) {
		const { page: fromPageNumber, route: fromRoute } = from
		const { page: toPageNumber } = to
		const alienPage =
			!fromRoute.options.paginationParent && !fromRoute.options.pagination

		// if we are coming from a pagination page

		if (alienPage) {
			prevHtml = null
			wrapper.innerHTML = ''
		}

		// if we are going forward
		if (toPageNumber > fromPageNumber) {
			// does the new page we want to insert already exist in the dom
			// this might be the case from POP actions
			// if it does already exist, do nothing and return
			const $newHtmlAlreadyExists = wrapper.querySelector(
				`[data-spon-page="${toPageNumber}"]`
			)

			if ($newHtmlAlreadyExists) {
				return
			}

			// remove the pagination button
			// if the previous html exits, that's where the button will be
			// if not look in the nextHtml sibling, that's where it's gonna be

			// set the current page number on data-spon-page attribute
			newHtml.setAttribute('data-spon-page', toPageNumber)

			// inject into the dom
			wrapper.appendChild(newHtml)

			const $previousWrapper = wrapper.querySelector(
				`[data-spon-page="${toPageNumber - 1}"]`
			)
			const $btnWrapper = $previousWrapper ? $previousWrapper : wrapper

			if (!alienPage) {
				toggleBtnState($btnWrapper, 'next', 'none')
				toggleBtnState(newHtml, 'prev', 'none')
			}

			if (newHtml.previousElementSibling) {
				toggleBtnState(newHtml.previousElementSibling, 'prev', 'none')
			}
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
					toggleBtnState(tempPrev, 'next', '')
					prevHtml.parentNode.removeChild(prevHtml)
					if (wrapper.children.length === 1) {
						toggleBtnState(tempPrev, 'prev', '')
					}
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
					toggleBtnState(newHtml, 'prev', '')
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
					toggleBtnState(nextHtml, 'prev', '')
					nextHtml = nextHtml.parentNode.insertBefore(newHtml, nextHtml)
					toggleBtnState(newHtml, 'next', 'none')
				}
				// reset the prevHtml ref
				prevHtml = null
			}
		}

		// update the title
		document.title = title
	}
}

export default [
	{
		path: '/',
		view: {}
	},
	{
		path: '/blog/',
		view: {},
		options: {
			paginationParent: true
		},
		children: {
			path: ':id',
			view: paginationExample,
			options: {
				pagination: true
			}
		}
	},
	{
		path: '/page-2/',
		view: {}
	},
	{
		path: '/page-3/',
		view: {}
	},
	{
		path: '/page-4/',
		view: {}
	},
	{
		path: '*',
		view: {}
	}
]

/*

	from /blog/p2/ PUSH
	to p3 PUSH
	from /blog/p3/ PUSH
	to p4 PUSH
	from /blog/p4/ PUSH
	to page-4 PUSH
	from /blog/p4/ POP
	to p4 POP
	from /blog/p3/ POP
	to p3 POP
	from /blog/p2/ POP
	to p2 POP

*/
