var Task = cb_require('tasks/task'),
	project = cb_require('project/project'),
	path = require('path');

var AppTask = function() {
	this.projectDir = process.cwd();
	this.projectFile = null;
};

AppTask.prototype = new Task();


AppTask.prototype = {
	run: function(cloudbridge) {

	}
};

AppTask.__project = null;

AppTask.prototype.__defineGetter__('project', function() {
	//return require(path.join(this.projectDir, 'cloudbridge.json'));

	if (AppTask.__project == null) {
		AppTask.__project  = project.load(this.projectDir);
	}

	return AppTask.__project;
});

module.exports = AppTask;