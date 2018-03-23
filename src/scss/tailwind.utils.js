const modularscale = require('modularscale-js')

const percentage = (x, y) => `${(x / y * 100).toFixed(4)}%`

module.exports = {
	percentage,
	widths,
	rem,
	em,
	calc,
	ms2rem,
	ms,
	gutter,
	rgba,
	rgbaRange,
	lines,
	msRange
}

const msSettings = {
	base: 16,
	ratio: 1.125
}

function widths(y) {
	return Array.from({ length: y - 1 }).reduce((a, c, i) => {
		a[`${i + 1}/${y}`] = percentage(i + 1, y)
		return a
	}, {})
}

function stripUnits(str) {
	const regExVal = new RegExp(/(-*(\d\.*)+)/, 'g')
	return regExVal.exec(str)[0]
}

function rem(input, base = 16) {
	const regExVal = new RegExp(/\d+/, 'g')
	return regExVal.exec(input) / base + 'rem'
}

function em(input, base = 16) {
	//const regExVal = new RegExp(/\d+/, 'g')
	return input / base + 'em'
}

function calc(min, max, start, stop) {
	console.log(min, max)

	return `calc(${min} + (${stripUnits(max)} - ${stripUnits(
		min
	)}) * ((100vw - ${start}px) / (${stop} - ${start})))`
}

function ms2rem(n, settings = msSettings) {
	return rem(modularscale(n, settings))
}

function ms(n, settings = msSettings) {
	return modularscale(n, settings)
}

function msRange(
	start,
	end,
	settings = {
		base: 16,
		ratio: 1.125
	}
) {
	const length = end + 1 - start
	return Array.from({ length: length }).reduce((acc, cur, i) => {
		acc[`ms${start + i}`] = rem(modularscale(start + i, settings))
		return acc
	}, {})
}

function gutter(n = 1, size = 20) {
	return rem(n * size)
}

function rgba(hex, opacity = 1) {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
		hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
	)

	return result
		? `rgba(${result
			.splice(1)
			.map(n => parseInt(n, 16))
			.join(',')}, ${opacity})`
		: null
}

function rgbaRange(hex, name = 'black', prefix = 'pc') {
	return Array.from({ length: 9 })
		.map((_, i) => rgba(hex, (i + 1) / 10))
		.reduce((a, c, i) => {
			a[`${name}-${(i + 1) * 10}${prefix}`] = c
			return a
		}, {})
}

function lines(start, end, { grid = 8, fs = 18 }) {
	const length = end + 1 - start
	return Array.from({ length: length }).reduce((acc, cur, i) => {
		acc[`${i}`] = i * grid / fs
		return acc
	}, {})
}
