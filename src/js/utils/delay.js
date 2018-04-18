export default (delay = 1000) =>
	new Promise(resolve => setTimeout(resolve, delay))
