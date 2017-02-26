'use strict'

const assert = require('assert')

const walk = require('.')

const assertValidStation = (s) => {
	assert.strictEqual(s.type, 'station')
	assert.strictEqual(typeof s.id, 'number')
	assert.strictEqual(typeof s.name, 'string')
	assert.strictEqual(typeof s.latitude, 'number')
	assert.strictEqual(typeof s.longitude, 'number')
}

const data = walk(8011102) // Berlin Gesundbrunnen
data.on('error', assert.ifError)

let stations = 0
data.on('data', (station) => {
	assertValidStation(station)

	stations++
	if (stations >= 100) data.stop()
})
