import {
	gutter,
	rem,
	em,
	ms2rem,
	rgba,
	rgbaRange,
	widths
} from './tailwind.utils' // eslint-disable-line

let colors = {
	transparent: 'transparent',

	black: '#22292f',
	'grey-darkest': '#3d4852',
	'grey-darker': '#606f7b',
	'grey-dark': '#8795a1',
	grey: '#b8c2cc',
	'grey-light': '#dae1e7',
	'grey-lighter': '#f1f5f8',
	'grey-lightest': '#f8fafc',
	white: '#ffffff',

	'red-darkest': '#3b0d0c',
	'red-darker': '#621b18',
	'red-dark': '#cc1f1a',
	red: '#e3342f',
	'red-light': '#ef5753',
	'red-lighter': '#f9acaa',
	'red-lightest': '#fcebea',

	'orange-darkest': '#462a16',
	'orange-darker': '#613b1f',
	'orange-dark': '#de751f',
	orange: '#f6993f',
	'orange-light': '#faad63',
	'orange-lighter': '#fcd9b6',
	'orange-lightest': '#fff5eb',

	'yellow-darkest': '#453411',
	'yellow-darker': '#684f1d',
	'yellow-dark': '#f2d024',
	yellow: '#ffed4a',
	'yellow-light': '#fff382',
	'yellow-lighter': '#fff9c2',
	'yellow-lightest': '#fcfbeb',

	'green-darkest': '#0f2f21',
	'green-darker': '#1a4731',
	'green-dark': '#1f9d55',
	green: '#38c172',
	'green-light': '#51d88a',
	'green-lighter': '#a2f5bf',
	'green-lightest': '#e3fcec',

	'teal-darkest': '#0d3331',
	'teal-darker': '#20504f',
	'teal-dark': '#38a89d',
	teal: '#4dc0b5',
	'teal-light': '#64d5ca',
	'teal-lighter': '#a0f0ed',
	'teal-lightest': '#e8fffe',

	'blue-darkest': '#12283a',
	'blue-darker': '#1c3d5a',
	'blue-dark': '#2779bd',
	blue: '#3490dc',
	'blue-light': '#6cb2eb',
	'blue-lighter': '#bcdefa',
	'blue-lightest': '#eff8ff',

	'indigo-darkest': '#191e38',
	'indigo-darker': '#2f365f',
	'indigo-dark': '#5661b3',
	indigo: '#6574cd',
	'indigo-light': '#7886d7',
	'indigo-lighter': '#b2b7ff',
	'indigo-lightest': '#e6e8ff',

	'purple-darkest': '#21183c',
	'purple-darker': '#382b5f',
	'purple-dark': '#794acf',
	purple: '#9561e2',
	'purple-light': '#a779e9',
	'purple-lighter': '#d6bbfc',
	'purple-lightest': '#f3ebff',

	'pink-darkest': '#451225',
	'pink-darker': '#6f213f',
	'pink-dark': '#eb5286',
	pink: '#f66d9b',
	'pink-light': '#fa7ea8',
	'pink-lighter': '#ffbbca',
	'pink-lightest': '#ffebef'
}

module.exports = {
	/*
  |-----------------------------------------------------------------------------
  | Colors                                  https://tailwindcss.com/docs/colors
  |-----------------------------------------------------------------------------
  |
  | The color pmodule.exports = {
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
  | Screens in Tailwind are translated to CSS media queries. They define the
  | responsive breakpoints for your project. By default Tailwind takes a
  | "mobile first" approach, where each screen size represents a minimum
  | viewport width. Feel free to have as few or as many screens as you
  | want, naming them in whatever way you'd prefer for your project.
  |
  | Tailwind also allows for more complex screen definitions, which can be
  | useful in certain situations. Be sure to see the full responsive
  | documentation for a complete list of options.
  |
  | Class name: .{screen}:{utility}
  |
  */

	screens: {
		sm: em('576px'),
		md: em('768px'),
		lg: em('992px'),
		xl: em('1200px')
	},

	/*
  |-----------------------------------------------------------------------------
  | Fonts                                    https://tailwindcss.com/docs/fonts
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your project's font stack, or font families.
  | Keep in mind that Tailwind doesn't actually load any fonts for you.
  | If you're using custom fonts you'll need to import them prior to
  | defining them here.
  |
  | By default we provide a native font stack that works remarkably well on
  | any device or OS you're using, since it just uses the default fonts
  | provided by the platform.
  |
  | Class name: .font-{name}
	|
	
  */

	fonts: {
		bold: ['Roboto', 'Helvetica Neue', 'sans-serif'],
		italic: ['Roboto', 'Helvetica Neue', 'sans-serif'],
		light: ['Roboto', 'Helvetica Neue', 'sans-serif'],
		'light-italic': ['Roboto', 'Helvetica Neue', 'sans-serif'],
		regular: ['Roboto', 'Helvetica Neue', 'sans-serif']
	},

	/*
  |-----------------------------------------------------------------------------
  | Text sizes                         https://tailwindcss.com/docs/text-sizing
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your text sizes. Name these in whatever way
  | makes the most sense to you. We use size names by default, but
  | you're welcome to use a numeric scale or even something else
  | entirely.
  |
  | By default Tailwind uses the "rem" unit type for most measurements.
  | This allows you to set a root font size which all other sizes are
  | then based on. That said, you are free to use whatever units you
  | prefer, be it rems, ems, pixels or other.
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
  | Here is where you define your font weights. We've provided a list of
  | common font weight names with their respective numeric scale values
  | to get you started. It's unlikely that your project will require
  | all of these, so we recommend removing those you don't need.
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
  | Here is where you define your line height values, or as we call
  | them in Tailwind, leadings.
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
  | Here is where you define your letter spacing values, or as we call
  | them in Tailwind, tracking.
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
  | Here is where you define your text colors. By default these use the
  | color palette we defined above, however you're welcome to set these
  | independently if that makes sense for your project.
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
  | Here is where you define your background colors. By default these use
  | the color palette we defined above, however you're welcome to set
  | these independently if that makes sense for your project.
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
  | Here is where you define your border widths. Take note that border
  | widths require a special "default" value set as well. This is the
  | width that will be used when you do not specify a border width.
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
  | Here is where you define your border colors. By default these use the
  | color palette we defined above, however you're welcome to set these
  | independently if that makes sense for your project.
  |
  | Take note that border colors require a special "default" value set
  | as well. This is the color that will be used when you do not
  | specify a border color.
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
  | Here is where you define your border radius values. If a `default` radius
  | is provided, it will be made available as the non-suffixed `.rounded`
  | utility.
  |
  | If your scale includes a `0` value to reset already rounded corners, it's
  | a good idea to put it first so other values are able to override it.
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
  | Here is where you define your width utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based numeric scale, a percentage
  | based fraction scale, plus some other common use-cases. You
  | can, of course, modify these values as needed.
  |
  |
  | It's also worth mentioning that Tailwind automatically escapes
  | invalid CSS class name characters, which allows you to have
  | awesome classes like .w-2/3.
  |
  | Class name: .w-{size}
  |
  */

	width: {
		...widths(12),
		'0': '0',
		auto: 'auto',
		px: '1px',
		full: '100%',
		screen: '100vw'
	},

	/*
  |-----------------------------------------------------------------------------
  | Height                                  https://tailwindcss.com/docs/height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your height utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based numeric scale plus some other
  | common use-cases. You can, of course, modify these values as
  | needed.
  |
  | Class name: .h-{size}
  |
  */

	height: {
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
  | Here is where you define your minimum width utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | couple common use-cases by default. You can, of course, modify
  | these values as needed.
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
  | Here is where you define your minimum height utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | few common use-cases by default. You can, of course, modify these
  | values as needed.
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
  | Here is where you define your maximum width utility sizes. These can
  | be percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based scale and a "full width" size,
  | which is basically a reset utility. You can, of course,
  | modify these values as needed.
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
		full: '100%'
	},

	/*
  |-----------------------------------------------------------------------------
  | Maximum height                      https://tailwindcss.com/docs/max-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your maximum height utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | couple common use-cases by default. You can, of course, modify
  | these values as needed.
  |
  | Class name: .max-h-{size}
  |
  */

	maxHeight: {
		full: '100%',
		screen: '100vh'
	},

	/*
  |-----------------------------------------------------------------------------
  | Padding                                https://tailwindcss.com/docs/padding
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your padding utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default we
  | provide a sensible rem based numeric scale plus a couple other
  | common use-cases like "1px". You can, of course, modify these
  | values as needed.
  |
  | Class name: .p{side?}-{size}
  |
  */

	padding: {
		px: rem(1),
		'0': 0,
		'0-25': gutter(0.25),
		'0-5': gutter(0.5),
		'0-75': gutter(0.75),
		'1': gutter(1),
		'1-25': gutter(1.25),
		'1-5': gutter(1.5),
		'1-75': gutter(1.75),
		'2': gutter(2),
		'2-25': gutter(2.25),
		'2-5': gutter(2.5),
		'2-75': gutter(2.75),
		'3': gutter(3), // 60
		'3-5': gutter(3.5), // 70
		'4': gutter(4), // 80
		'4-5': gutter(4.5), // 90
		'5': gutter(5) // 100
	},

	/*
  |-----------------------------------------------------------------------------
  | Margin                                  https://tailwindcss.com/docs/margin
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your margin utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default we
  | provide a sensible rem based numeric scale plus a couple other
  | common use-cases like "1px". You can, of course, modify these
  | values as needed.
  |
  | Class name: .m{side?}-{size}
  |
  */

	margin: {
		auto: 'auto',
		px: rem(1),
		'0': 0,
		'0-25': gutter(0.25),
		'0-5': gutter(0.5),
		'0-75': gutter(0.75),
		'1': gutter(1),
		'1-25': gutter(1.25),
		'1-5': gutter(1.5),
		'1-75': gutter(1.75),
		'2': gutter(2),
		'2-25': gutter(2.25),
		'2-5': gutter(2.5),
		'2-75': gutter(2.75),
		'3': gutter(3), // 60
		'3-5': gutter(3.5), // 70
		'4': gutter(4), // 80
		'4-5': gutter(4.5), // 90
		'5': gutter(5) // 100
	},

	/*
  |-----------------------------------------------------------------------------
  | Negative margin                https://tailwindcss.com/docs/negative-margin
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your negative margin utility sizes. These can
  | be percentage based, pixels, rems, or any other units. By default we
  | provide matching values to the padding scale since these utilities
  | generally get used together. You can, of course, modify these
  | values as needed.
  |
  | Class name: .-m{side?}-{size}
  |
  */

	negativeMargin: {
		px: '1px',
		'0': '0',
		'0-25': gutter(-0.25),
		'0-5': gutter(-0.5),
		'0-75': gutter(-0.75),
		'1': gutter(-1),
		'1-25': gutter(-1.25),
		'1-5': gutter(-1.5),
		'1-75': gutter(-1.75),
		'2': gutter(-2),
		'2-25': gutter(-2.25),
		'2-5': gutter(-2.5),
		'2-75': gutter(-2.75),
		'3': gutter(-3), // 60
		'3-5': gutter(-3.5), // 70
		'4': gutter(-4), // 80
		'4-5': gutter(-4.5), // 90
		'5': gutter(-5) // 100
	},

	/*
  |-----------------------------------------------------------------------------
  | Shadows                                https://tailwindcss.com/docs/shadows
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your shadow utilities. As you can see from
  | the defaults we provide, it's possible to apply multiple shadows
  | per utility using comma separation.
  |
  | If a `default` shadow is provided, it will be made available as the non-
  | suffixed `.shadow` utility.
  |
  | Class name: .shadow-{size?}
  |
  */

	shadows: {
		default: `0 0 ${rem(30)} rgba(0,0,0,0.15)`,
		md: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)',
		lg: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)',
		inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
		fill: '0px 60px 120px rgba(0, 0, 0, 0.1)',
		none: 'none'
	},

	/*
  |-----------------------------------------------------------------------------
  | Z-index                                https://tailwindcss.com/docs/z-index
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your z-index utility values. By default we
  | provide a sensible numeric scale. You can, of course, modify these
  | values as needed.
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
  | Here is where you define your opacity utility values. By default we
  | provide a sensible numeric scale. You can, of course, modify these
  | values as needed.
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
  | Here is where you define your SVG fill colors. By default we just provide
  | `fill-current` which sets the fill to the current text color. This lets you
  | specify a fill color using existing text color utilities and helps keep the
  | generated CSS file size down.
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
  | Here is where you define your SVG stroke colors. By default we just provide
  | `stroke-current` which sets the stroke to the current text color. This lets
  | you specify a stroke color using existing text color utilities and helps
  | keep the generated CSS file size down.
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
		fontWeights: false,
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
		svgStroke: false,
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
