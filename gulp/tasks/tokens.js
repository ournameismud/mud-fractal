import gulp from 'gulp'
import jsonSass from 'json-sass'
import source from 'vinyl-source-stream'
import rename from 'gulp-rename'
import fs from 'fs'
import path from 'path'

export function tokens() {
	const paths = {
		src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.tokens.src),
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.tokens.dest
		)
	}

	PATH_CONFIG.tokens.files
		.map(token => {
			const name = token.split('.').shift()
			return {
				src: `${paths.src}/${token}`,
				json: token,
				prefix: `$${name}: `,
				output: `_${name}.scss`
			}
		})
		.forEach(token => {
			return fs
				.createReadStream(token.src)
				.pipe(
					jsonSass({
						prefix: token.prefix
					})
				)
				.pipe(source(token.json))
				.pipe(rename(token.output))
				.pipe(gulp.dest(paths.dest))
		})
}

gulp.task('tokens', tokens)
