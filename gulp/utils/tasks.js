module.exports = {
	getTasks,
	getWatch
}

function getTasks() {
	return {
		assetTasks: Object.keys(TASK_CONFIG).filter(
			key => TASK_CONFIG[key].task === 'asset'
		),
		codeTasks: Object.keys(TASK_CONFIG).filter(
			key => TASK_CONFIG[key].task === 'code'
		)
	}
}

function getWatch() {
	return {
		watchList: Object.keys(TASK_CONFIG).filter(key => TASK_CONFIG[key].watch)
	}
}
