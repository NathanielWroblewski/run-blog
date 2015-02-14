namespace('Trackman.Models')

Trackman.Models.TCXConverter = function(config) {
  this.id = config.id,
  this.URL = '//trackman.s3.amazonaws.com/tcx-json/' + this.id + '.json',

  this.fetch = function(callback) {
    this._initialize()

    d3.json(this.URL, function(error, json) {
      this._parse(json)
      callback()

    }.bind(this))
  },

  this.toJSON = function() {
    return this.state
  },

  this._initialize = function() {
    this.state = {}
  },

  this.getHeartRates = function() {
    var distances = this.state.distance
    return this.state.heartRate.map(function(bpm, index) {
      return { x: distances[index], y: Number(bpm) }
    })
  },

  this.getCadence = function() {
    var distances = this.state.distance
    return this.state.cadence.map(function(spm, index) {
      return { x: distances[index], y: Number(spm) * 2 }
    })
  },

  this._parse = function(response) {
    this.state.distance = this._parseDistance(response.distanceMeters)
    this.state.cadence = this._filterZero(this._numberify(response.runCadence))
    this.state.heartRate = this._filterZero(this._numberify(response.heartRateBpm))
    this.state.speed = this._filterZero(this._numberify(response.speed))
    this.state.maximumSpeed = this._max(response.maximumSpeed)
    this.state.maximumCadence = this._max(response.maxRunCadence)
    this.state.maximumHeartRate = this._max(response.maximumHeartRateBpm)
    this.state.averageHeartRate = this._avg(response.averageHeartRateBpm)
    this.state.averageCadence = this._avg(response.avgRunCadence)
    this.state.averageSpeed = this._avg(response.avgSpeed)
    this.state.steps = this._sum(response.steps)
  },

  this._parseDistance = function(meters) {
    var miles = meters.slice(1).map(function(datum) {
      return Number(datum) * 0.000621371
    })

    var filteredMiles = miles.filter(function(datum, index, array) {
      return datum > array[index - 1]
    })

    filteredMiles.push(miles[miles.length - 1])

    return filteredMiles
  },

  this._max = function(array) {
    return d3.max(this._numberify(array))
  },

  this._avg = function(array) {
    return this._sum(array) / array.length
  },

  this._sum = function(array) {
    return this._numberify(array).reduce(function(memo, current) {
      return memo += current
    }, 0)
  },

  this._numberify = function(array) {
    return array.map(function(datum) { return Number(datum) })
  },

  this._filterZero = function(array) {
    return array.filter(function(datum) {
      return datum > 0
    })
  }
}
