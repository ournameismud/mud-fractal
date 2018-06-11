const R = require('ramda')
const { ms2rem } = require('./tailwind.utils')

const range = {
	minvw: '320px',
	maxvw: '1400px'
}

module.exports = {
	plugins: [
		require('tailwindcss-fluid')({
			textSizes: R.compose(
				R.reduce((acc, [key, value]) => {
					acc[key] = { ...value, ...range }
					return acc
				}, {}),
				Object.entries
			)({
				sm: {
					min: ms2rem(-2),
					max: ms2rem(0)
				},

				base: {
					min: ms2rem(0),
					max: ms2rem(1)
				}
			})
		}),

		require('tailwindcss-alpha')({
			modules: {
				backgroundColors: true
			},
			alpha: {
				'10': 0.1,
				'20': 0.2
			}
		})
	]
}
