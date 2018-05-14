export default node => {
	node.classList.add('test-class')

	// events.emit('some-event')

	return () => {
		console.log('destroy Module B')
	}
}
