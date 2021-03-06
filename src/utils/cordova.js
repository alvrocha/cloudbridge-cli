'use strict';

let path = require('path'),
	shelljs = require('shelljs'),
	semver = require('semver'),
	xml2js = require('xml-js').xml2js,
	Runner = cb_require('utils/runner');

class Cordova extends Runner {

	static findCordovaAndroidVersion(projectDir) {
		var content = shelljs.cat(path.join(projectDir, 'config.xml')),
			cordovaConfig = xml2js(content, {
				compact: true
			}),
			android,
			engines = cordovaConfig.widget.engine,
			version = '7.0.0';

		if (!Array.isArray(engines)) {
			engines = [engines];
		}

		android = engines.find(function(element) {
			return (element._attributes.name === 'android');
		});

		if (android !== null) {
			version = semver.coerce(android._attributes.spec).version;
		}

		return version;
	}

	static create() {
		var { args, options } = this.parseAguments(...arguments);

		return this.spawn(['create'].concat(args), options);
	}

	static build() {
		var { args, options } = this.parseAguments(...arguments);

		return this.spawn(['build'].concat(args), options);
	}

	static run() {
		var { args, options } = this.parseAguments(...arguments);

		return this.spawn(['run'].concat(args), options);
	}

}

Cordova.init('cordova');

module.exports = Cordova;
