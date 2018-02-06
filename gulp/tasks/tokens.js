const gulp = require('gulp')
const jsonSass = require('json-sass')
const source = require('vinyl-source-stream')
const rename = require('gulp-rename')
const fs = require('fs')
const path = require('path')

module.exports = {
	tokens
}

gulp.task('tokens', tokens)

function tokens() {
	const config = require(path.resolve(
		process.env.PWD,
		'src/scss/tailwind.config.js'
	))

	const { colors, screens: breakpoints, fonts } = config
	;[
		{ src: colors, name: 'colors' },
		{ src: fonts, name: 'fonts' },
		{ src: breakpoints, name: 'breakpoints' }
	]
		.map(({ src, name }) => {
			return {
				json: JSON.stringify(src, null, 2),
				prefix: `$${name}:`,
				output: `_${name}.scss`
			}
		})
		.forEach(({ output, json, prefix }) => {
			return fs.writeFile(
				path.resolve(process.env.PWD, 'src/scss/_tokens', output),
				`${prefix} ${json
					.replace(/['"]+/g, '')
					.replace(/{/g, '(')
					.replace(/}/g, ')')
					.replace(/\[/g, '(')
					.replace(/]/g, ')') + ';'}`,
				() => {}
			)
		})
}
