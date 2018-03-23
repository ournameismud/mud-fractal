const gulp = require('gulp')
const htmlhint = require('gulp-htmlhint')
const path = require('path')
const { handleErrors } = require('../utils/logs')

module.exports = {
	validateHtml
}

function validateHtml() {
	const test = path.resolve(
		process.env.PWD,
		'deploy/library/components/preview',
		'**.html'
	)
	const dont = path.resolve(
		process.env.PWD,
		'deploy/library/components/preview',
		'symbols.html'
	)
	return gulp
		.src([test, '!' + dont])
		.pipe(htmlhint('.htmlhintrc'))
		.pipe(htmlhint.reporter('htmlhint-stylish'))
		.pipe(htmlhint.failOnError({ suppress: true }))
		.on('error', handleErrors)
		.on('finish', () => {
			console.log('yyyeeeaah roy')
		})
}

gulp.task('validate:html', validateHtml)
