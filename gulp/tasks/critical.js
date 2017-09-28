import gulp from 'gulp'
import critical from 'critical'
import rename from 'gulp-rename'
import gulpif from 'gulp-if'
import htmlreplace from 'gulp-html-replace'
import path from 'path'

export function critialCss() {
	const { paths, templates, inputBase, outputBase } = PATH_CONFIG.critical

	paths.map(({ input, output }) => {
		const { url, source } = input
		const { name, dist } = output
		critical
			.generate({
				base: path.resolve(process.env.PWD, inputBase),
				src: url,
				...TASK_CONFIG.critical
			})
			.then(output => {
				gulp
					.src(path.resolve(process.env.PWD, templates, source))
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
						gulpif(
							typeof name !== 'undefined',
							rename({
								basename: name
							})
						)
					)
					.pipe(gulp.dest(path.resolve(process.env.PWD, outputBase, dist)))
			})
			.catch(err => console.log(err))
	})
}

gulp.task('critical', critialCss)
