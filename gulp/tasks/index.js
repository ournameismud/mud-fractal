const { scss } = require('./scss')
const { images } = require('./images')
const { svgs } = require('./svgs')
const { symbols } = require('./symbols')
const { favicons, json, cssFonts, fonts, staticAssets } = require('./assets')
const { serviceWorker } = require('./scripts')
const { html } = require('./html/index')
const { cms } = require('./cms')

module.exports = {
	scss,
	images,
	svgs,
	symbols,
	favicons,
	json,
	cssFonts,
	fonts,
	serviceWorker,
	html,
	cms,
	staticAssets
}
