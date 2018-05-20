// A solution for React 16 complaining of missing rAF.

const jsdom = require('jsdom')
const { JSDOM } = jsdom

const dom = new JSDOM(
	'<!DOCTYPE html><html><head><style>body:after{content:"root";}</style></head><body></body></html>'
)

global.window = dom.window
global.document = dom.window.document

// Simulate window resize event
const resizeEvent = document.createEvent('Event')
resizeEvent.initEvent('resize', true, true)

global.window.resizeTo = (width, height) => {
	global.window.innerWidth = width || global.window.innerWidth
	global.window.innerHeight = height || global.window.innerHeight
	global.window.dispatchEvent(resizeEvent)
}

global.requestAnimationFrame = function(callback) {
	setTimeout(callback, 0)
}

// global.document.createElement = jest.fn(() => ({
// 	style: {
// 		transition: 'opacity 300ms ease',
// 		animation: 'test 300ms'
// 	}
// }))

Object.defineProperty(document, 'currentStyle', {
	value: document.createElement('style')
})

Object.defineProperty(window, 'matchMedia', {
	value: jest.fn(a => {
		return { matches: global.innerWidth > parseInt(a.match(/\d+/)[0], 10) }
	})
})
