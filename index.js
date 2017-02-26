'use strict'

const {PassThrough} = require('stream')
const Queue = require('queue')
const db = require('db-hafas')

const defaults = {
	concurrency: 2,
	timeout: 10 * 1000
}

const walk = (first, opt = {}) => {
	opt = Object.assign({}, defaults, opt)

	const out = new PassThrough({objectMode: true})
	const queue = Queue(opt)
	const visited = {}
	let nrOfStations = 0
	let nrOfRequests = 0

	const stats = () => {
		out.emit('stats', {
			stations: nrOfStations,
			requests: nrOfRequests,
			queued: queue.length
		})
	}

	const onStations = (stations) => {
		for (let station of stations) {
			if (visited[station.id]) return
			visited[station.id] = true

			nrOfStations++
			out.emit('data', station)
			queue.push(queryAdjacent(station.id))
		}
		stats()
	}

	const queryAdjacent = (id) => (cb) => {
		nrOfRequests++
		stats()

		db.departures(id)
		.then((deps) => Promise.all(deps.map((dep) =>
			db.locations(dep.direction, {addresses: false, poi: false})
			.then(onStations)
		)))
		.then(() => cb(), cb)
	}

	queue.on('error', (err) => out.emit('error', err))
	queue.on('end', () => out.end())

	setImmediate(() => {
		queue.push(queryAdjacent(first))
		queue.start()
	})

	return out
}

module.exports = walk
