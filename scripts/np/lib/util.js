'use strict';
const readPkgUp = require('read-pkg-up');

exports.readPkg = () => {
	const pkg = readPkgUp.sync().pkg;

	if (!pkg) {
		throw new Error(`No package.json found. Make sure you're in the correct project.`);
	}

	return pkg;
};
