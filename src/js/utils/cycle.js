export default (start = 0, array) => {
	let a = start
	const total = array.length

	return {
		next: () => {
			a += 1
			return a % total
		}
	}
}
