const { fractal } = require('./index')
const { exportPaths } = require('./utils')

module.exports = {
	buildFractal
}

function buildFractal() {
	const logger = fractal.cli.console
	const builder = fractal.web.builder()

	builder.on('progress', (completed, total) =>
		logger.update(`Exported ${completed} of ${total} items`, 'info')
	)
	builder.on('error', err => logger.error(err.message))

	return builder.build().then(() => {
		logger.success('Fractal build completed!')
		return exportPaths(fractal)
	})
}
