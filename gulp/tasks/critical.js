const gulp = require('gulp')
const critical = require('critical')
const util = require('gulp-util')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')
const htmlreplace = require('gulp-html-replace')
const path = require('path')

module.exports = {
	critialCss
}

gulp.task('critical', critialCss)

function critialCss() {
	const { paths, urlBase } = PATH_CONFIG.critical
	util.log('starting critical css')

	return Promise.all(
		paths.map(({ url, source }, i) => {
			const options =
				util.env.config === 'cms'
					? {
						src: url
					}
					: {
						base: path.resolve(process.env.PWD, urlBase),
						src: path.resolve(process.env.PWD, url)
					}
			return new Promise((resolve, reject) => {
				critical
					.generate({
						...options,
						...TASK_CONFIG.critical
					})
					.catch(e => {
						console.log(e)
					})
					.then(output => {
						gulp
							.src(path.resolve(process.env.PWD, source))
							.pipe(
								htmlreplace(
									{
										critical: {
											src: null,
											tpl: `<style>${output}</style>`
										}
									},
									{
										keepBlockTags: true
									}
								)
							)
							.pipe(
								gulp.dest(
									path.resolve(
										process.env.PWD,
										source.split(source.substr(source.lastIndexOf('/')))[0]
									)
								)
							)
							.on('end', resolve)
					})
			}).catch(err => util.log(err))
		})
	)
}
