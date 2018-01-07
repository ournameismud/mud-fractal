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
				src: path.resolve(process.env.PWD, PATH_CONFIG.src, paths.src, token),
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
