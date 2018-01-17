'use strict'

const walk = require('.')

const friedrichstr = '8011306'
const stations = walk(friedrichstr)

stations
.on('data', console.log)
.on('error', console.error)
