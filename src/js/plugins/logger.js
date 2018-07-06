import debug from 'debug'

window.log = global.log = debug('app:log') // eslint-disable-line no-multi-assign

// eslint-disable-next-line no-unused-expressions
process.env.NODE_ENV === 'development'
	? debug.enable('app:log')
	: debug.disable('app:log')

log(`Logging is enabled!, NODE_ENV: ${process.env.NODE_ENV}`)
