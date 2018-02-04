const browserSync = require('browser-sync')
const gulp = require('gulp')
const { fractalServer } = require('./fractal/server')
const { devServer } = require('./html/server')
const { path } = require('path')

gulp.task('server:fractal', fractalServer)
gulp.task('server:cms', devServer)

gulp.task('server', () => {
	// Resolve path from PWD
	if (SERVER.server && SERVER.server.baseDir) {
		SERVER.server.baseDir = path.resolve(process.env.PWD, SERVER.server.baseDir)
	}

	browserSync.init({
		...SERVER,
		...TASK_CONFIG.server
	})
})
