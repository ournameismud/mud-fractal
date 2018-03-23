// A solution for React 16 complaining of missing rAF.

global.requestAnimationFrame = function(callback) {
	setTimeout(callback, 0)
}

global.document.createElement = jest.fn(() => ({
	style: {
		transition: 'opacity 300ms ease',
		animation: 'test 300ms'
	}
}))
