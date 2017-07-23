#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const {isatty} = require('tty')
const differ = require('ansi-diff-stream')
const esc = require('ansi-escapes')
const ndjson = require('ndjson')

const pkg = require('./package.json')
const walk = require('.')

const argv = minimist(process.argv.slice(2))

if (argv.h || argv.help) {
	process.stdout.write(`\
${pkg.description}

Usage:
	discover-db-stations [first] > stations.ndjson

Options:
	-s, --silent	Don't show progress reports on stderr.
`)
	process.exit(0)
}

if (argv.v || argv.version) {
	process.stdout.write(pkg.name + ' ' + pkg.version + '\n')
	process.exit(0)
}

const data = walk(argv._[0] + '' || '8011102') // Berlin Gesundbrunnen
data
.on('error', console.error)
.pipe(ndjson.stringify())
.pipe(process.stdout)

if (!argv.s && !argv.silent) {
	const clearReports = isatty(process.stderr.fd) && !isatty(process.stdout.fd)


	let reporter = process.stderr
	if (clearReports) {
		reporter = differ()
		reporter.pipe(process.stderr)
	}

	const report = ({requests, stations, queued}) => {
		reporter.write([
			requests + (requests === 1 ? ' request' : ' requests'),
			stations + (stations === 1 ? ' station' : ' stations'),
			queued + ' queued'
		].join(', ') + (clearReports ? '' : '\n'))
	}
	data.on('stats', report)
}
