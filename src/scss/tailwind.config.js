const { backgroundSize, backgroundColors } = require('./tailwind/backgrounds')
const {
	borderColors,
	borderRadius,
	borderWidths
} = require('./tailwind/borders')
const { colors } = require('./tailwind/colors')
const { zIndex } = require('./tailwind/layout')
const { opacity, shadows, svgFill, svgStroke } = require('./tailwind/misc')
const { plugins } = require('./tailwind/plugins')
const { screens } = require('./tailwind/screens')
const {
	width,
	minWidth,
	maxWidth,
	height,
	minHeight,
	maxHeight
} = require('./tailwind/sizing')
const { margin, negativeMargin, padding } = require('./tailwind/spacing')
const {
	fonts,
	fontWeights,
	leading,
	tracking,
	textColors,
	textSizes
} = require('./tailwind/typography')

module.exports = {
	backgroundSize,
	backgroundColors,

	borderColors,
	borderRadius,
	borderWidths,

	colors,

	zIndex,

	opacity,
	shadows,
	svgFill,
	svgStroke,

	plugins,

	screens,

	width,
	minWidth,
	maxWidth,
	height,
	minHeight,
	maxHeight,

	margin,
	negativeMargin,
	padding,

	fonts,
	fontWeights,
	leading,
	tracking,
	textColors,
	textSizes,

	modules: {
		appearance: [],
		backgroundAttachment: [],
		backgroundColors: ['hover', 'responsive'],
		backgroundPosition: [],
		backgroundRepeat: [],
		backgroundSize: [],
		borderColors: ['responsive'],
		borderRadius: ['responsive'],
		borderStyle: ['responsive'],
		borderWidths: ['responsive'],
		cursor: [],
		display: ['responsive'],
		flexbox: ['responsive'],
		float: [],
		fonts: [],
		fontWeights: [],
		height: ['responsive'],
		leading: ['responsive'],
		lists: [],
		margin: ['responsive'],
		maxHeight: ['responsive'],
		maxWidth: ['responsive'],
		minHeight: ['responsive'],
		minWidth: ['responsive'],
		negativeMargin: [],
		opacity: ['responsive'],
		overflow: [],
		padding: ['responsive'],
		pointerEvents: [],
		position: ['responsive'],
		resize: [],
		shadows: ['focus', 'hover'],
		svgFill: [],
		svgStroke: [],
		textAlign: [],
		textColors: ['hover', 'responsive'],
		textSizes: ['responsive'],
		textStyle: [],
		tracking: [],
		userSelect: [],
		verticalAlign: [],
		visibility: ['responsive'],
		whitespace: [],
		width: ['responsive'],
		zIndex: ['responsive']
	},

	/*
  |-----------------------------------------------------------------------------
  | Advanced Options         https://tailwindcss.com/docs/configuration#options
  |-----------------------------------------------------------------------------
  |
  | Here is where you can tweak advanced configuration options. We recommend
  | leaving these options alone unless you absolutely need to change them.
  |
  */

	options: {
		prefix: '',
		important: false,
		separator: ':'
	}
}
