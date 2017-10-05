const path = require('path')
module.exports = {
	context: {
		colors: require(path.resolve(process.env.PWD, 'src/tokens/colors.json')),
		fonts: require(path.resolve(process.env.PWD, 'src/tokens/fonts.json')),
		breakpoints: require(path.resolve(
			process.env.PWD,
			'src/tokens/breakpoints.json'
		)),
		symbols: require(path.resolve(process.env.PWD, 'src/tokens/symbols.json'))
	}
}

//
