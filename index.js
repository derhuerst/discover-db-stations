'use strict'

const {PassThrough} = require('stream')
const Queue = require('queue')
const db = require('db-hafas')

const defaults = {
	concurrency: 2,
	timeout: 10 * 1000,
	autostart: false
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

	const onStations = (stations, from) => {
		for (let station of stations) {
			if (visited[station.id]) return
			visited[station.id] = true

			nrOfStations++
			out.emit('data', station)
			queue.push(queryDepartures(station.id))
			if (from) queue.push(queryJourneys(from, station.id))
		}
		stats()
	}

	const queryLocations = (name, from) => (cb) => {
		nrOfRequests++
		stats()

		db.locations(name, {addresses: false, poi: false})
		.then((stations) => {
			onStations(stations, from)
			cb()
		})
		.catch(cb)
	}

	const queryDepartures = (id) => (cb) => {
		nrOfRequests++
		stats()

		db.departures(id)
		.then((deps) => {
			for (let dep of deps) {
				const from = dep.station.id
				queue.push(queryLocations(dep.direction, from))
			}
			cb()
		})
		.catch(cb)
	}

	const queryJourneys = (from, to) => (cb) => {
		nrOfRequests++
		stats()

		db.journeys(from, to, {passedStations: true})
		.then((journeys) => {
			for (let journey of journeys) {
				for (let part of journey.parts) {
					if (!Array.isArray(part.passed)) continue
					const stations = part.passed.map((dep) => dep.station)
					onStations(stations)
				}
			}
			cb()
		})
		.catch(cb)
	}

	queue.on('error', (err) => out.emit('error', err))
	queue.on('end', () => out.end())
	out.stop = () => queue.end()

	setImmediate(() => {
		queue.push(queryDepartures(first))
		queue.start()
	})

	return out
}

module.exports = walk
