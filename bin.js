#!/usr/bin/env node
'use strict'

const run = require('hafas-discover-stations/bin')

const pkg = require('./package.json')
const walk = require('.')

const gesundbrunnen = '8011102'
const config = Object.assign({}, pkg, {first: gesundbrunnen})

run(walk, config)
