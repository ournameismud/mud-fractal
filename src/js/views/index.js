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
			// if the previous html exits, that's where the button will be
			// if not look in the nextHtml sibling, that's where it's gonna be
			const container = prevHtml
				? prevHtml
				: nextHtml ? nextHtml.nextElementSibling : wrapper
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
					newHtml.querySelector('[data-pagination-next]').style.display = 'none'
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
		children: {
			path: ':id',
			view: paginationExample,
			pagination: true
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
