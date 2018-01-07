const gulp = require('gulp')
const svgmin = require('gulp-svgmin')
const { handleErrors } = require('../utils/logs')
const inject = require('gulp-inject')
const gulpif = require('gulp-if')
const svgSymbols = require('gulp-svg-symbols')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const browserSync = require('browser-sync')
const path = require('path')

module.exports = {
	symbols
}

gulp.task('symbols', symbols)

function symbols() {
	const paths = {
		src: [
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				PATH_CONFIG.symbols.src,
				'*.svg'
			)
		],
		dest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.public,
			PATH_CONFIG.symbols.dest
		),
		scssTemplate: path.resolve(__dirname, '../utils/symbols.tmp.scss'),
		scssOutputPath: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			TASK_CONFIG.symbols.scssOutputPath
		),
		scssOutputFile: TASK_CONFIG.symbols.scssOutputFile,
		sourceFile: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			TASK_CONFIG.symbols.sourceFile
		),

		fileDest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.symbols.fileDest
		),
		fileName: PATH_CONFIG.symbols.fileName,
		docsSrc: [
			path.resolve(
				process.env.PWD,
				PATH_CONFIG.src,
				PATH_CONFIG.symbols.docs,
				PATH_CONFIG.symbols.json
			)
		],
		docsDest: path.resolve(
			process.env.PWD,
			PATH_CONFIG.src,
			PATH_CONFIG.symbols.docs
		)
	}

	const svgs = gulp
		.src(paths.src)
		.pipe(svgmin())
		.pipe(
			svgSymbols({
				svgId: 'icon--%f',
				className: '.icon--%f',
				title: false,
				warn: true,
				fontSize: 0,
				templates: ['default-svg', paths.scssTemplate]
			})
		)
		.pipe(gulpif(/[.]svg$/, gulp.dest(paths.dest)))
		.pipe(gulpif(/[.]scss$/, rename(paths.scssOutputFile)))
		.pipe(gulpif(/[.]scss$/, gulp.dest(paths.scssOutputPath)))

	function fileContents(filePath, file) {
		return file.contents.toString()
	}

	gulp
		.src(paths.docsSrc)
		.pipe(
			inject(
				gulp.src(paths.src, {
					read: false
				}),
				{
					starttag: '"symbols": [',
					endtag: ']',
					transform: function(filepath, file, i, length) {
						return `"${file.relative.split('.svg')[0]}"${i + 1 < length
							? ','
							: ''}`
					}
				}
			)
		)
		.pipe(gulp.dest(paths.docsDest))

	return gulp
		.src(paths.sourceFile)
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(rename(paths.fileName))
		.on('error', handleErrors)
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true
			})
		)
		.pipe(gulp.dest(paths.fileDest))
		.pipe(browserSync.stream())
}
