export default (
	$node,
	o = {
		defaults: {},
		name: ''
	}
) => {
	const { input, name } = o
	let options = input

	if (!$node.dataset) return options

	// create options object, merge opts from params
	// try and merge any json options from the dom
	try {
		const o = $node.dataset[name]
		const json = typeof o === 'string' ? JSON.parse(o) : {}
		options = {
			...options,
			...json
		}
	} catch (err) {
		throw new Error(
			`Error reading JSON from data attribute data-${name} on:`,
			$node
		)
	}
	return options
}
