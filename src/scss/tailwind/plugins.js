const R = require('ramda')
const { ms2rem, numRange, px2em } = require('./tailwind.utils')

const range = {
	minvw: px2em('320px'),
	maxvw: px2em('1400px')
}

const sizes = R.compose(
	R.reduce((acc, [key, value]) => {
		acc[key] = { ...value, ...range }

		return acc
	}, {}),
	Object.entries
)({
	'2xl': {
		min: ms2rem(6),
		max: ms2rem(10)
	},

	xl: {
		min: ms2rem(4),
		max: ms2rem(8)
	},

	lg: {
		min: ms2rem(2),
		max: ms2rem(6)
	},

	sm: {
		min: ms2rem(-2),
		max: ms2rem(0)
	},

	xs: {
		min: ms2rem(-2),
		max: ms2rem(-1)
	},

	body: {
		min: ms2rem(0),
		max: ms2rem(1)
	}
})

module.exports = {
	plugins: [
		require('tailwindcss-fluid')({
			textSizes: sizes
		}),

		// https://github.com/bradlc/tailwindcss-alpha
		require('tailwindcss-alpha')({
			modules: {
				backgroundColors: true
			},
			alpha: (function nums(from, to) {
				return R.reduce((acc, curr) => {
					acc[`${curr * 10}`] = curr / 10

					return acc
				}, {})(numRange(from, to, value => value))
			})(0, 10)
		}),

		require('tailwindcss-visuallyhidden')(),

		// object fit
		function({ addUtilities }) {
			addUtilities(
				{
					'.object-cover': {
						'object-fit': 'cover'
					},
					'.object-fill': {
						'object-fit': 'fill'
					},
					'.object-none': {
						'object-fit': 'none'
					},
					'.object-scale-down': {
						'object-fit': 'scale-down'
					},
					'.object-contain': {
						'object-fit': 'contain'
					},
					'.object-fit-center': {
						'object-position': 'center center'
					}
				},
				{
					variants: ['responsive']
				}
			)
		},

		// position fix perf fix
		function({ addUtilities }) {
			addUtilities(
				{
					'.perf-fixed': {
						position: 'fixed',
						transform: 'translateZ(0)'
					}
				},
				{
					variants: ['responsive']
				}
			)
		},

		// rotate
		function({ addUtilities }) {
			addUtilities(
				{
					'.rotate-90': {
						transform: 'rotate(90deg)'
					},
					'.rotate-180': {
						transform: 'rotate(180deg)'
					},
					'.rotate-270': {
						transform: 'rotate(270deg)'
					}
				},
				{
					variants: ['responsive']
				}
			)
		},

		// translate
		function({ addUtilities }) {
			addUtilities(
				{
					'.x-100': {
						transform: 'translate3d(100%, 0, 0)'
					},
					'.x--100': {
						transform: 'translate3d(-100%, 0, 0)'
					},
					'.x-0': {
						transform: 'translate3d(0, 0, 0)'
					},
					'.y-100': {
						transform: 'translate3d(0, 100%, 0)'
					},
					'.y--100': {
						transform: 'translate3d(0, -100%, 0)'
					},
					'.y-0': {
						transform: 'translate3d(0, 0, 0)'
					}
				},
				{
					variants: ['responsive']
				}
			)
		},

		// transitions
		function({ addUtilities }) {
			addUtilities(
				{
					'.trans': {
						transition: 'all 300ms ease'
					},
					'.trans-opacity': {
						'transition-property': 'opacity'
					},
					'.trans-transform': {
						'transition-property': 'transform'
					},
					'.trans-color': {
						'transition-property': 'color'
					},
					'.trans-bg': {
						'transition-property': 'background-color'
					},
					'.trans-fast': {
						'transition-duration': '150ms'
					},
					'.trans-normal': {
						'transition-duration': '300ms'
					},
					'.trans-slow': {
						'transition-duration': '750ms'
					}
				},
				{
					variants: ['responsive', 'hover']
				}
			)
		}
	]
}
