export default node => {
	console.log('Mount Module B')

	// events.emit('some-event')

	return () => {
		console.log('destroy Module B')
	}
}
