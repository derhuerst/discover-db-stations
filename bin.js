#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
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

process.stderr.write('\n')
const report = ({requests, stations, queued}) => {
	process.stderr.write(esc.cursorUp(1) + esc.eraseLine + esc.cursorTo(0) + [
		requests + (requests === 1 ? ' request' : ' requests'),
		stations + (stations === 1 ? ' station' : ' stations'),
		queued + ' queued'
	].join(', ') + '\n')
}

const data = walk(argv._[0] || 8011102) // Berlin Gesundbrunnen
if (!argv.s && !argv.silent) data.on('stats', report)
data.on('error', console.error)

data
.pipe(ndjson.stringify())
.pipe(process.stdout)
