#!/usr/bin/env node
'use strict';
const logSymbols = require('log-symbols');
const meow = require('meow');
const updateNotifier = require('update-notifier');
const version = require('./lib/version');
const ui = require('./lib/ui');
const np = require('./');

const cli = meow(`
	Usage
	  $ np <version>

	  Version can be:
	    ${version.SEMVER_INCREMENTS.join(' | ')} | 1.2.3

	Options
		--any-branch  Allow publishing from any branch
		--tag         Publish under a given dist-tag
		--dry-run     Do everything but git tag, commit and npm publish

	Examples
	  $ np
	  $ np patch
	  $ np 1.0.2
	  $ np 1.0.2-beta.3 --tag=beta
`);

updateNotifier({pkg: cli.pkg}).notify();

Promise
	.resolve()
	.then(() => {
		if (cli.input.length > 0) {
			return Object.assign({}, cli.flags, {
				confirm: true,
				version: cli.input[0]
			});
		}

		return ui(cli.flags);
	})
	.then(options => {
		if (!options.confirm) {
			process.exit(0);
		}

		return options;
	})
	.then(options => np(options.version, options))
	.then(pkg => {
		if (cli.flags.dryRun) {
			console.log(`\n ${pkg.name} dryrun publish finished 🕵️`);
		} else {
			console.log(`\n ${pkg.name} ${pkg.version} published 🎉`);
		}
	})
	.catch(err => {
		console.error(`\n${logSymbols.error} ${err.message}`);
		process.exit(1);
	});
