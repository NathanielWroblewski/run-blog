namespace('Trackman.Models')

Trackman.Models.PaceConverter = function(config) {
  this.id = config.id,
  this.PACE_URL = '//trackman.s3.amazonaws.com/geojson/' + this.id + '.json',

  this.fetch = function(callback) {
    this._initialize()

    d3.json(this.PACE_URL, function(error, json) {
      var responseData = json.features[0]

      this._parse(responseData)
      callback()

    }.bind(this))
  },

  this.toJSON = function() {
    return this.state
  },

  this.getPaces = function() {
    return this.state.paces.map(function(pace, index) {
      return { x: this.state.totalDistance[index] || 0, y: pace || 0}
    }, this)
  },

  this.getSpeeds = function() {
    return this.state.totalDistance.map(function(distance, index) {
      return {
        x: distance || 0,
        y: (distance || 0) / (this.state.secondsElapsed[index] / 60 / 60 || 1)
      }
    }, this)
  },

  this.getElevations = function() {
    return this.state.elevations.map(function(elevation, index) {
      return { x: this.state.totalDistance[index] || 0, y: elevation || 0 }
    }, this)
  },

  // private

  this._initialize = function() {
    this.state = {}
    this.state.coordinates    = []
    this.state.elevations     = []
    this.state.times          = []
    this.state.secondsElapsed = []
    this.state.distances      = []
    this.state.totalDistance  = []
    this.state.paces          = []
    this.state.averagePace = 0
  },

  this._parse = function(response) {
    var coordinates = response.geometry.coordinates,
        length = coordinates.length,
        times = response.properties.coordTimes,
        previousCoord = null

    coordinates.forEach(function(datum, index) {
      var longitude = datum[0],
          latitude  = datum[1],
          elevation = datum[2],
          latlong   = [latitude, longitude],
          haversine = Trackman.Utils.haversine

      this.state.coordinates.push(latlong)
      if (index < length - 1) this.state.elevations.push(elevation)
      this.state.times.push(times[index])
      if (index) this.state.distances.push(haversine(previousCoord, latlong))

      previousCoord = latlong
    }.bind(this))

    this.state.totalDistance = this._calculateTotalDistance()
    this.state.paces = this._calculatePace()
    this.state.averagePace = this._calculateAveragePace()
  },

  this._calculateTotalDistance = function() {
    var memo = 0
    return this.state.distances.map(function(distance) {
      return memo += distance
    })
  },

  this._calculatePace = function() {
    var startTime = moment(this.state.times[0])

    return this.state.totalDistance.map(function(distance, index) {
      var currentTime = moment(this.state.times[index + 1]),
          elapsedTime = currentTime.subtract(startTime),
          secondsElapsed = moment.duration(elapsedTime).asSeconds()

      this.state.secondsElapsed.push(secondsElapsed)

      return secondsElapsed / distance
    }, this)
  },

  this._calculateAveragePace = function() {
    var sum = this.state.paces.reduce(function(prev, current) {
      return prev + current
    })

    return sum / this.state.paces.length
  }
}
