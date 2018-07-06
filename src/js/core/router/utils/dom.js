export const setTransitionAttributes = (() => {
	const $body = document.body

	return {
		lifecycle: state => {
			$body.setAttribute('data-transition-state', state)
		},

		from: from => {
			$body.setAttribute('data-transition-from', from)
		},

		to: to => {
			$body.setAttribute('data-transition-to', to)
		},

		toggleCustomBodyProp: prop => {
			if (prop) {
				$body.setAttribute('data-page-with', prop)
			} else {
				$body.removeAttribute('data-page-with')
			}
		}
	}
})()
