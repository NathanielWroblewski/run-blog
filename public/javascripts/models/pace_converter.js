namespace('Trackman.Models')

Trackman.Models.PaceConverter = function(config) {
  this.id = config.id,
  this.PACE_URL = '//trackman.s3.amazonaws.com/' + this.id + '.json',

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
      return { x: this.state.totalDistance[index], y: pace }
    }, this)
  }

  // private

  this._initialize = function() {
    this.state = {}
    this.state.coordinates   = []
    this.state.elevations    = []
    this.state.times         = []
    this.state.paces         = []
    this.state.distances     = []
    this.state.totalDistance = []
  },

  this._parse = function(response) {
    var coordinates = response.geometry.coordinates,
        times = response.properties.coordTimes
        previousCoord = null

    coordinates.forEach(function(datum, index) {
      var longitude = datum[0],
          latitude  = datum[1],
          elevation = datum[2],
          latlong   = [latitude, longitude],
          haversine = Trackman.Utils.haversine

      this.state.coordinates.push(latlong)
      this.state.elevations.push(elevation)
      this.state.times.push(times[index])
      if (index) this.state.distances.push(haversine(previousCoord, latlong))

      previousCoord = latlong
    }.bind(this))

    this.state.totalDistance = this._calculateTotalDistance()
    this.state.paces = this._calculatePace()
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
          elapsedTime = currentTime.subtract(startTime)

      return moment.duration(elapsedTime).asSeconds() / distance
    }, this)
  }
}
