# discover-db-stations

**Discover [Deutsche Bahn](http://db.de/) stations by querying departures.** It tries to find all stations that all trains known by Deutsche Bahn stop at.

[![npm version](https://img.shields.io/npm/v/discover-db-stations.svg)](https://www.npmjs.com/package/discover-db-stations)
[![build status](https://img.shields.io/travis/derhuerst/discover-db-stations.svg)](https://travis-ci.org/derhuerst/discover-db-stations)
[![dependency status](https://img.shields.io/david/derhuerst/discover-db-stations.svg)](https://david-dm.org/derhuerst/discover-db-stations)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/discover-db-stations.svg)](https://david-dm.org/derhuerst/discover-db-stations#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/discover-db-stations.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)

I ran the script for testing purposes and it gave me **66591 stations** (as opposed to the ~7000 stations in the official datasets). You get a dump using the [Dat share](https://datproject.org/) at `dat://70770908e28720dc0723eb7c864b8b757480bd6bfb346fe5927a3e4fc31483d9`.


## Installing

```shell
npm install -g discover-db-stations
```


## Usage

```shell
discover-db-stations <station-id> >stations.ndjson
```

[`bin.js`](bin.js) is an example for how to use this module programmatically.


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/discover-db-stations/issues).
