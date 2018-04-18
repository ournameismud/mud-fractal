import * as R from 'ramda'

export default R.memoizeWith(R.identity, (type = 'transition') => {
	let types =
		type === 'transition'
			? {
				OTransition: 'oTransitionEnd',
				WebkitTransition: 'webkitTransitionEnd',
				MozTransition: 'transitionend',
				transition: 'transitionend'
			}
			: {
				OAnimation: 'oAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd',
				MozAnimation: 'animationend',
				animation: 'animationend'
			}

	const elem = document.createElement('div')

	return Object.keys(types).reduce((prev, trans) => {
		return undefined !== elem.style[trans] ? types[trans] : prev
	}, '')
})
