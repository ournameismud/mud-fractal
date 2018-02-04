const gulp = require('gulp')
const gutil = require('gulp-util')
const rename = require('gulp-rename')
const path = require('path')
const fs = require('fs')

function initTaskConfig(mode) {
	return gulp
		.src([`gulp/modes/${mode}.task.js`])
		.pipe(
			rename({
				basename: 'task.config'
			})
		)
		.pipe(gulp.dest(path.join(process.env.PWD, 'config')))
}

function initPathConfig(mode) {
	return gulp
		.src([`gulp/modes/${mode}.path.json`])
		.pipe(
			rename({
				basename: 'path.config'
			})
		)
		.pipe(gulp.dest(path.join(process.env.PWD, 'config')))
}

function initFiles(node) {
	return gulp
		.src(['src/**/*', `templates/${node}/**/*`, '*.gitkeep'])
		.pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)))
}

function initCraft() {
	return gulp
		.src(['gulp/path.config.cms.json'])
		.pipe(gulp.dest(path.join(process.env.PWD, 'config')))
}

gulp.task('init:fractal', () => {
	init('fractal')
})

gulp.task('init:html', () => {
	init('html')
})

function init(mode) {
	if (fs.existsSync(path.join(process.env.PWD, 'config'))) {
		gutil.log('config folder already exists, skipping init:config task')
		return
	}

	initPathConfig(mode)
	initTaskConfig(mode)
	initCraft()

	if (fs.existsSync(path.join(process.env.PWD, PATH_CONFIG.src))) {
		gutil.log('src folder already exists, skipping init:config task')
		return
	}

	initFiles(mode)
}
