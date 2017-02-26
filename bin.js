#!/usr/bin/env node
'use strict'

const minimist = require('minimist')
const ndjson = require('ndjson')

const pkg = require('./package.json')
const walk = require('.')

const argv = minimist(process.argv.slice(2))

if (argv.h || argv.help) {
	process.stdout.write(`\
${pkg.description}

Usage:
	discover-db-stations [first] > stations.ndjson
`)
	process.exit(0)
}

if (argv.v || argv.version) {
	process.stdout.write(pkg.name + ' ' + pkg.version + '\n')
	process.exit(0)
}

const data = walk(argv._[0] || 8011102) // Berlin Gesundbrunnen
data.on('error', console.error)

data
.pipe(ndjson.stringify())
.pipe(process.stdout)
