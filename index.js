'use strict'

const createWalk = require('hafas-discover-stations')
const db = require('db-hafas')

const walk = createWalk(db)

module.exports = walk
