const R = require('ramda')
const modularscale = require('modularscale-js')

const BASE_FONT_SIZE = 16

const percentage = (x, y) => `${(x / y * 100).toFixed(4)}%`
const stripUnits = R.compose(R.head, R.match(/\d+/g))

const msSettings = {
	ratio: 1.125,
	base: BASE_FONT_SIZE
}

function gutter(n = 1, size = 20) {
	return px2rem(n * size)
}

function numRange(from, to, mutation) {
	const domain = to + 1 - from
	const array = Array.from({ length: domain })

	let counter = from - 1

	return R.map(() => {
		counter += 1

		return mutation(counter)
	})(array)
}

function msRange(from, to, settings = msSettings) {
	const values = numRange(from, to, counter => {
		return {
			key: counter,
			value: ms2rem(counter, settings)
		}
	})

	return R.reduce((acc, curr) => {
		acc[`ms-${curr.key}`] = curr.value
		return acc
	}, {})(values)
}

function spacing(num = 12, slices = 4) {
	const rows = num * slices
	const values = numRange(1, rows, counter => counter / slices)

	return R.reduce((acc, curr) => {
		const key = R.compose(R.join('-'), R.split('.'))(curr.toString())
		acc[key] = gutter(curr)
		return acc
	}, {})(values)
}

function px2rem(value) {
	let num = value

	if (typeof value === 'string') {
		num = stripUnits(value)
	}

	return `${num / BASE_FONT_SIZE}rem`
}

function px2em(value) {
	let num = value

	if (typeof value === 'string') {
		num = stripUnits(value)
	}

	return `${num / BASE_FONT_SIZE}em`
}

function ms2rem(ms, settings = msSettings) {
	return px2rem(modularscale(ms, settings))
}

function hex2rgba(hex, alpha = 1) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
		hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
	)

	return result
		? `rgba(${result
			.splice(1)
			.map(n => parseInt(n, 16))
			.join(',')}, ${alpha})`
		: null
}

function columns(cols = 12) {
	const array = Array.from({ length: cols })
	const mapIndexed = R.addIndex(R.map)

	return R.compose(
		R.reduce((acc, curr) => {
			acc[`${curr}/${cols}`] = percentage(curr, cols)
			return acc
		}, {}),
		R.take(cols - 1),
		mapIndexed((val, index) => index + 1)
	)(array)
}


module.exports = {
	px2rem,
	px2em,
	ms2rem,
	msRange,
	hex2rgba,
	columns,
	spacing,
	gutter
}
