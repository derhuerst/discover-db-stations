'use strict'

const assert = require('assert')

const walk = require('.')

const assertValidStation = (s) => {
	assert.ok(s.type === 'stop' || s.type === 'station')
	assert.strictEqual(typeof s.id, 'string')
	assert.strictEqual(typeof s.name, 'string')
	assert.ok(s.location)
	assert.strictEqual(s.location.type, 'location')
	assert.strictEqual(typeof s.location.latitude, 'number')
	assert.strictEqual(typeof s.location.longitude, 'number')
}

const data = walk('8011102') // Berlin Gesundbrunnen
data.on('error', assert.ifError)

let stations = 0
data.on('data', (station) => {
	try {
		assertValidStation(station)
	} catch (err) {
		console.error(err)
		process.exitCode = 1
	}

	stations++
	if (stations >= 100) data.stop()
})
