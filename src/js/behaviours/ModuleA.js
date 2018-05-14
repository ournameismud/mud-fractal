export default node => {
	console.log('Mount Module A')

	return () => {
		console.log('destroy Module A')
	}
}
