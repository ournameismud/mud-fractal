import { gutter, rem, ms2rem, rgba, rgbaRange } from './tailwind.utils'

let colors = {
	transparent: 'transparent',

	blush: '#f39c97',
	peach: '#ffc7ad',
	blue: '#aac8dc',
	'light-blue': '#ccdff4',
	lilac: '#c0bfd7',
	black: '#242423',
	'black-50': '#919191',
	'black-20': '#c8c8c8',
	white: '#ffffff',
	'white-15': 'rgba(255, 255, 255, 0.15)'
}

module.exports = {
	/*
  |-----------------------------------------------------------------------------
  | Colors                                  https://tailwindcss.com/docs/colors
  |-----------------------------------------------------------------------------
  |
  | The color palette defined above is also assigned to the "colors" key of
  | your Tailwind config. This makes it easy to access them in your CSS
  | using Tailwind's config helper. For example:
  |
  | .error { color: config('colors.red') }
  |
  */

	colors: colors,

	/*
  |-----------------------------------------------------------------------------
  | Screens                      https://tailwindcss.com/docs/responsive-design
  |-----------------------------------------------------------------------------
  |
  | Class name: .{screen}:{utility}
  |
  */

	screens: {
		sm: rem('576px'),
		md: rem('768px'),
		lg: rem('992px'),
		xl: rem('1200px')
	},

	/*
  |-----------------------------------------------------------------------------
  | Fonts                                    https://tailwindcss.com/docs/fonts
  |-----------------------------------------------------------------------------
  |
  | Class name: .font-{name}
	|
	
  */

	fonts: {
		'san-b': ['FS Albert Bold', 'Helvetica Neue', 'sans-serif'],
		serif: ['MessinaSerifWeb-Regular', 'Georgia', 'serif'],
		'serif-b': ['MessinaSerifWeb-Bold', 'Georgia', 'serif'],
		'serif-i': ['MessinaSerifWeb-RegularItalic', 'Georgia', 'serif']
	},

	/*
  |-----------------------------------------------------------------------------
  | Text sizes                         https://tailwindcss.com/docs/text-sizing
  |-----------------------------------------------------------------------------
  |
  | Class name: .text-{size}
  |
  */

	textSizes: {
		'2xl': rem(45),
		xl: rem(30),
		lg: rem(24),
		body: rem(18),
		sm: rem(12),
		xs: rem(9)
	},

	/*
  |-----------------------------------------------------------------------------
  | Font weights                       https://tailwindcss.com/docs/font-weight
  |-----------------------------------------------------------------------------
  |
  | Class name: .font-{weight}
  |
  */

	fontWeights: {
		light: 300,
		normal: 400,
		bold: 700
	},

	/*
  |-----------------------------------------------------------------------------
  | Leading (line height)              https://tailwindcss.com/docs/line-height
  |-----------------------------------------------------------------------------
  |
  | Class name: .leading-{size}
  |
  */

	leading: {
		none: 1,
		tight: 1.25,
		normal: 1.5,
		loose: 2,

		'2xl': 60 / 45,
		xl: 42 / 30,
		lg: 32 / 24,
		body: 32 / 18,
		sm: 24 / 12,
		xs: 20 / 9
	},

	/*
  |-----------------------------------------------------------------------------
  | Tracking (letter spacing)       https://tailwindcss.com/docs/letter-spacing
  |-----------------------------------------------------------------------------
  |
  | Class name: .tracking-{size}
  |
  */

	tracking: {
		tight: '-0.05em',
		normal: '0',
		wide: '0.05em'
	},

	/*
  |-----------------------------------------------------------------------------
  | Text colors                         https://tailwindcss.com/docs/text-color
  |-----------------------------------------------------------------------------
  |
  | Class name: .text-{color}
  |
  */

	textColors: colors,

	/*
  |-----------------------------------------------------------------------------
  | Background colors             https://tailwindcss.com/docs/background-color
  |-----------------------------------------------------------------------------
  |
  | Class name: .bg-{color}
  |
  */

	backgroundColors: colors,

	/*
  |-----------------------------------------------------------------------------
  | Border widths                     https://tailwindcss.com/docs/border-width
  |-----------------------------------------------------------------------------
  |
  | Class name: .border{-side?}{-width?}
  |
  */

	borderWidths: {
		default: rem(1),
		'0': '0',
		'1': rem(1),
		'2': rem(2)
	},

	/*
  |-----------------------------------------------------------------------------
  | Border colors                     https://tailwindcss.com/docs/border-color
  |-----------------------------------------------------------------------------
  |
  | Class name: .border-{color}
  |
  */

	borderColors: Object.assign({ default: colors['grey-light'] }, colors),

	/*
  |-----------------------------------------------------------------------------
  | Border radius                    https://tailwindcss.com/docs/border-radius
  |-----------------------------------------------------------------------------
  |
  | Class name: .rounded{-side?}{-size?}
  |
  */

	borderRadius: {
		none: '0',
		sm: '.125rem',
		default: '.25rem',
		lg: '.5rem',
		full: '9999px'
	},

	/*
  |-----------------------------------------------------------------------------
  | Width                                    https://tailwindcss.com/docs/width
  |-----------------------------------------------------------------------------
  |
  | Class name: .w-{size}
  |
  */

	width: {
		input: rem(330),

		'0': '0',
		auto: 'auto',
		px: '1px',
		'1/3': '33.333%',
		'1/10': '10%',
		'2/10': '20%',
		'3/10': '30%',
		'4/10': '40%',
		'5/10': '50%',
		'6/10': '60%',
		'7/10': '70%',
		'8/10': '80%',
		'9/10': '90%',
		full: '100%',
		screen: '100vw'
	},

	/*
  |-----------------------------------------------------------------------------
  | Height                                  https://tailwindcss.com/docs/height
  |-----------------------------------------------------------------------------
  | needed.
  |
  | Class name: .h-{size}
  |
  */

	height: {
		input: rem(60),

		'lg-btn': rem(80),
		tag: rem(30),
		'sm-tag': rem(22),

		lightbox: rem(660),
		'lg-card': rem(560),

		'0': '0',
		auto: 'auto',
		px: '1px',
		full: '100%',
		screen: '100vh'
	},

	/*
  |-----------------------------------------------------------------------------
  | Minimum width                        https://tailwindcss.com/docs/min-width
  |-----------------------------------------------------------------------------
  |
  | Class name: .min-w-{size}
  |
  */

	minWidth: {
		'0': '0',
		full: '100%'
	},

	/*
  |-----------------------------------------------------------------------------
  | Minimum height                      https://tailwindcss.com/docs/min-height
  |-----------------------------------------------------------------------------
  |
  | Class name: .min-h-{size}
  |
  */

	minHeight: {
		'0': '0',
		full: '100%',
		screen: '100vh'
	},

	/*
  |-----------------------------------------------------------------------------
  | Maximum width                        https://tailwindcss.com/docs/max-width
  |-----------------------------------------------------------------------------
  |
  | Class name: .max-w-{size}
  |
  */
	maxWidth: {
		xs: '10rem',
		sm: '30rem',
		md: '40rem',
		lg: '50rem',
		xl: '60rem',
		full: '100%',

		lightbox: rem(440),
		card: rem(370),
		subscribe: rem(770)
	},

	/*
  |-----------------------------------------------------------------------------
  | Maximum height                      https://tailwindcss.com/docs/max-height
  |-----------------------------------------------------------------------------
  |
  | Class name: .max-h-{size}
  |
  */

	maxHeight: {
		full: '100%',
		screen: '100vh',

		lightbox: rem(660),
		'lg-card': rem(560)
	},

	/*
  |-----------------------------------------------------------------------------
  | Padding                                https://tailwindcss.com/docs/padding
  |-----------------------------------------------------------------------------
  |
  | Class name: .p{side?}-{size}
  |
  */

	padding: {
		px: rem(1),
		'0': 0,
		'1': gutter(0.25),
		'2': gutter(0.5),
		'3': gutter(0.75),
		'4': gutter(1),
		'5': gutter(1.25),
		'6': gutter(1.5),
		'7': gutter(1.75),
		'8': gutter(2),
		'9': gutter(2.25),
		'10': gutter(2.5),
		'11': gutter(2.75),
		'12': gutter(3), // 60
		'13': gutter(3.5), // 70
		'14': gutter(4), // 80
		'15': gutter(4.5), // 90
		'16': gutter(5) // 100
	},

	/*
  |-----------------------------------------------------------------------------
  | Margin                                  https://tailwindcss.com/docs/margin
  |-----------------------------------------------------------------------------
  |
  | Class name: .m{side?}-{size}
  |
  */

	margin: {
		auto: 'auto',
		px: rem(1),
		'0': 0,
		'1': gutter(0.25),
		'2': gutter(0.5),
		'3': gutter(0.75),
		'4': gutter(1),
		'5': gutter(1.25),
		'6': gutter(1.5),
		'7': gutter(1.75),
		'8': gutter(2),
		'9': gutter(2.25),
		'10': gutter(2.5),
		'11': gutter(2.75),
		'12': gutter(3)
	},

	/*
  |-----------------------------------------------------------------------------
  | Negative margin                https://tailwindcss.com/docs/negative-margin
  |-----------------------------------------------------------------------------
  |
  | Class name: .-m{side?}-{size}
  |
  */

	negativeMargin: {
		px: '1px',
		'0': '0',
		'1': '0.25rem',
		'2': '0.5rem',
		'3': '0.75rem',
		'4': '1rem',
		'6': '1.5rem',
		'8': '2rem'
	},

	/*
  |-----------------------------------------------------------------------------
  | Shadows                                https://tailwindcss.com/docs/shadows
  |-----------------------------------------------------------------------------
  |
  | Class name: .shadow-{size?}
  |
  */

	shadows: {
		default: `0 0 ${rem(30)} rgba(0,0,0,0.15)`,
		md: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
		lg: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
		inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
		none: 'none'
	},

	/*
  |-----------------------------------------------------------------------------
  | Z-index                                https://tailwindcss.com/docs/z-index
  |-----------------------------------------------------------------------------
  |
  | Class name: .z-{index}
  |
  */

	zIndex: {
		auto: 'auto',
		'0': 0,
		'10': 10,
		'20': 20,
		'30': 30,
		'40': 40,
		'50': 50
	},

	/*
  |-----------------------------------------------------------------------------
  | Opacity                                https://tailwindcss.com/docs/opacity
  |-----------------------------------------------------------------------------
  |
  | Class name: .opacity-{name}
  |
  */

	opacity: {
		'0': '0',
		'25': '.25',
		'50': '.5',
		'75': '.75',
		'100': '1'
	},

	/*
  |-----------------------------------------------------------------------------
  | SVG fill                                   https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  |
  | Class name: .fill-{name}
  |
  */

	svgFill: {
		current: 'currentColor'
	},

	/*
  |-----------------------------------------------------------------------------
  | SVG stroke                                 https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  |
  | Class name: .stroke-{name}
  |
  */

	svgStroke: {
		current: 'currentColor'
	},

	/*
  |-----------------------------------------------------------------------------
  | Modules                  https://tailwindcss.com/docs/configuration#modules
  |-----------------------------------------------------------------------------
  |
  | Here is where you control which modules are generated and what variants are
  | generated for each of those modules.
  |
  | Currently supported variants: 'responsive', 'hover', 'focus'
  |
  | To disable a module completely, use `false` instead of an array.
  |
  */

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
		shadows: [],
		svgFill: [],
		svgStroke: false,
		textAlign: [],
		textColors: ['hover'],
		textSizes: ['responsive'],
		textStyle: [],
		tracking: [],
		userSelect: [],
		verticalAlign: [],
		visibility: [],
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
