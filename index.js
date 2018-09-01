'use strict'

const createWalk = require('hafas-discover-stations')
const createHafas = require('db-hafas')

const hafas = createHafas('discover-db-stations')
const walk = createWalk(hafas)

module.exports = walk
