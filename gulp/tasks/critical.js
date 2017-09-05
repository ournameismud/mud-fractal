import gulp from 'gulp'
import critical from 'critical'
import htmlreplace from 'gulp-html-replace'
import path from 'path'


export function critialCss() {
	const { paths, templates } = PATH_CONFIG.critical

	paths.map(({url, template}) => {
		critical.generate({
			base:  path.resolve(process.env.PWD, PATH_CONFIG.dest),
			src: url,
			...TASK_CONFIG.critical
		}).then((output) => {
			gulp.src(path.resolve(process.env.PWD, templates, template))
				.pipe(htmlreplace({
					critical: {
						src: null,
						tpl: `<style>${output}</style>`
					}
				}, {
					keepBlockTags: true
				}))
				.pipe(gulp.dest(path.resolve(process.env.PWD, templates)))
		}).catch(err => console.log(err))
	})
}


gulp.task('critical', critialCss)