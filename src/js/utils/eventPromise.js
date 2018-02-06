export default (event, element, callback) => {
	let complete = false

	const done = (resolve, e) => {
		e.stopPropagation()
		element.removeEventListener(event, done)
		if (e.target === element && !complete) {
			complete = true
			resolve()
			return
		}
	}

	return new Promise(resolve => {
		callback && callback()
		element.addEventListener(event, done.bind(null, resolve))
	})
}
