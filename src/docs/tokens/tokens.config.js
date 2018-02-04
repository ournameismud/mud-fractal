const path = require('path')
const config = require(path.resolve(
	process.env.PWD,
	'src/scss/tailwind.config.js'
))

module.exports = {
	context: {
		colors: config.colors,
		fonts: config.fonts,
		breakpoints: config.screens,
		widths: config.width,
		padding: config.padding,
		margin: config.margin,
		textSizes: config.textSizes,
		symbols: require(path.resolve(
			process.env.PWD,
			'src/images/svg-symbols/symbols.json'
		))
	}
}

//
