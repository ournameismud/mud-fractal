import gulp from 'gulp'
import svgmin from 'gulp-svgmin'
import { handleErrors } from '../libs/utils'
import inject from 'gulp-inject'
import gulpif from 'gulp-if'
import svgSymbols from 'gulp-svg-symbols'
import rename from 'gulp-rename'
import htmlmin from 'gulp-htmlmin'
// import cheerio from 'gulp-cheerio'
import browserSync from 'browser-sync'
import path from 'path'

export function symbols() {

	const paths = {
		src: [path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.symbols.src, '*.svg')],
		dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.symbols.dest),
		scssTemplate: path.resolve(process.env.PWD, PATH_CONFIG.src, TASK_CONFIG.symbols.scssTemplate),
		scssOutputPath: path.resolve(process.env.PWD, PATH_CONFIG.src, TASK_CONFIG.symbols.scssOutputPath),
		scssOutputFile: TASK_CONFIG.symbols.scssOutputFile,
		sourceFile: path.resolve(process.env.PWD, PATH_CONFIG.src, TASK_CONFIG.symbols.sourceFile),
		
		fileDest: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.symbols.fileDest),
		fileName: PATH_CONFIG.symbols.fileName
	}
	
	const svgs = gulp.src(paths.src)
		.pipe(svgmin())
		/*
		.pipe(cheerio({
			run($) {
				$('[fill]').removeAttr('fill');
			},
			parserOptions: { 
				xmlMode: true 
			}
		}))
		*/
		.pipe(svgSymbols({
			svgId:      'icon--%f',
			className:  '.icon--%f',
			title:      false,
			warn:       true,
			fontSize:   0,
			templates: ['default-svg', paths.scssTemplate]
		}))
		.pipe(gulpif( /[.]svg$/, gulp.dest(paths.dest)))
		.pipe(gulpif( /[.]scss$/, rename(paths.scssOutputFile)))
		.pipe(gulpif( /[.]scss$/, gulp.dest(paths.scssOutputPath)))


	function fileContents (filePath, file) {
		return file.contents.toString()
	}

	return gulp
		.src(paths.sourceFile)
		.pipe(inject(svgs, { transform: fileContents }))
		.pipe(rename(paths.fileName))
		.on('error', handleErrors)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(paths.fileDest))
		.pipe(browserSync.stream())

}	

gulp.task('symbols', symbols)
