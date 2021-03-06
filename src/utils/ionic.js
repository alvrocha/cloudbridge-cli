'use strict';

let shelljs = require('shelljs'),
	semver = require('semver'),
	Runner = cb_require('utils/runner'),
	path = require('path'),
	pathKey = Object.keys(process.env).find((key) => key.toUpperCase() == 'PATH');

class Ionic extends Runner {

	static get config() {
		return {
			get: this.configGet.bind(this),
			set: this.configSet.bind(this),
			unset: this.configUnset.bind(this)
		};
	}

	static get cordova() {
		return {
			build: this.buildCordova.bind(this),
			run: this.runCordova.bind(this)
		};
	}

	static start() {
		var { args, options } = this.parseAguments(...arguments);

		if (semver.lt(this.version, '4.0.0')) {
			args = args.map((item) => {
				if (item.startsWith('--package-id=')) {
					return item.replace('--package-id=', '--bundle-id=');
				}

				return item;
			});
		}

		return this.spawn(['start'].concat(args), options);
	}

	static buildCordova() {
		var { args, options } = this.parseAguments(...arguments);

		return this.spawn(['cordova', 'build'].concat(args), options);
	}

	static runCordova() {
		var { args, options } = this.parseAguments(...arguments);

		return this.spawn(['cordova', 'run'].concat(args), options);
	}

	static configGet(p1, p2, p3) {
		var value = 'undefined',
			command = 'ionic config get ' + Array.prototype.join.call(arguments, ' '),
			result = shelljs.exec(command, { silent: true, stdio: 'ignore' });

		if (result.stdout.trim() !== 'undefined') {
			result = shelljs.exec(command + ' --json', { silent: true, stdio: 'ignore' });

			value = JSON.parse(result.stdout);
		}

		return value;
	}

	static configSet(p1, p2, p3) {
		var command = 'ionic config set ' + Array.prototype.join.call(arguments, ' ');

		shelljs.exec(command, { silent: true, stdio: 'ignore' });
	}

	static configUnset(p1, p2, p3) {
		var command = 'ionic config unset ' + Array.prototype.join.call(arguments, ' ');

		shelljs.exec(command, { silent: true, stdio: 'ignore' });
	}


	static parseAguments() {
		//console.log('arguments', arguments);

		var { args, options } = Runner.parseAguments(...arguments);

		//console.log('args', args);
		//console.log('options', options);

		if (!options.env) {
			options.env = Object.assign({}, process.env);
		}

		options.env[pathKey] = [
			path.join(process.cwd(), 'node_modules', '.bin'),
			options.env[pathKey]
		].join(path.delimiter);

		return { args, options };
	}

}

Ionic.init('ionic');

module.exports = Ionic;
