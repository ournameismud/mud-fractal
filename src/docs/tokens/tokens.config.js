const path = require('path')
module.exports = {
	context: {
		colors: require(path.join(process.cwd(), 'src/tokens/colors.json')),
		fonts: require(path.join(process.cwd(), 'src/tokens/fonts.json')),
		breakpoints: require(path.join(
			process.cwd(),
			'src/tokens/breakpoints.json'
		)),
		symbols: require(path.join(process.cwd(), 'src/tokens/symbols.json'))
	}
}
