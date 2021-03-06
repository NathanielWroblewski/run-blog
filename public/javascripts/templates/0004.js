!function() {
  Trackman.Map.render(29.668204179033637,-98.10488177463412,'0004',15,true)

  var tcx = new Trackman.Models.TCXConverter({id: '0004'})
  tcx.fetch(function() {
    var margin = {top: 20, right: 10, bottom: 30, left: 40}

    var heartRateChart = new Trackman.Charts.LineChart({
      el:      '#heart-rate',
      data:    tcx.getHeartRates().slice(20),
      height:  200 - margin.top - margin.bottom,
      width:   650 - margin.left - margin.right,
      margins: margin,
      pointRadius: 3,
      yFormat: function(d) { return d },
      xAxisLabel: 'Miles',
      xAxisLabelPosition: '-5',
      yAxisLabel: 'bpm',
      yCount: 5
    })

    heartRateChart.render()

    Trackman.Tooltip.listenTo('#heart-rate .point', function(datum) {
      var data = datum.dataset,
          heartRate = Number(data.y),
          mile = Number(data.x).toFixed(2)

      return (
        '<p style="color: #444; font-size: 1em;">' +
          '<strong>Distance: </strong>' + mile + ' miles<br/>' +
          '<strong>Heart Rate: </strong>' + heartRate + ' bpm' +
        '</p>'
      )
    })

    var cadenceChart = new Trackman.Charts.LineChart({
      el:      '#cadence',
      data:    tcx.getCadence().slice(10),
      height:  200 - margin.top - margin.bottom,
      width:   650 - margin.left - margin.right,
      margins: margin,
      pointRadius: 3,
      yCount: 5,
      yFormat: function(d) { return d },
      xAxisLabel: 'Miles',
      xAxisLabelPosition: '-5',
      yAxisLabel: 'spm'
    })

    cadenceChart.render()

    Trackman.Tooltip.listenTo('#cadence .point', function(datum) {
      var data = datum.dataset,
          cadence = Number(data.y),
          mile = Number(data.x).toFixed(2)

      return (
        '<p style="color: #444; font-size: 1em;">' +
          '<strong>Distance: </strong>' + mile + ' miles<br/>' +
          '<strong>Cadence: </strong>' + cadence + ' steps/min' +
        '</p>'
      )
    })
  })

  var run = new Trackman.Models.PaceConverter({id: '0004'})
  run.fetch(function() {
    var margin = {top: 20, right: 10, bottom: 30, left: 40}

    var elevationChart = new Trackman.Charts.LineChart({
      el:      '#elevation',
      data:    run.getElevations(),
      height:  100 - margin.top - margin.bottom,
      width:   650 - margin.left - margin.right,
      margins: margin,
      pointRadius: 3,
      yCount: 3,
      yFormat: function(d) { return d },
      xAxisLabel: 'Miles',
      xAxisLabelPosition: '-5'
    })

    elevationChart.render()

    Trackman.Tooltip.listenTo('#elevation .point', function(datum) {
      var data = datum.dataset,
          elevation = Number(data.y).toFixed(2),
          mile = Number(data.x).toFixed(2)

      return (
        '<p style="color: #444; font-size: 1em;">' +
          '<strong>Distance: </strong>' + mile + ' miles<br/>' +
          '<strong>Elevation: </strong>' + elevation + ' ft' +
        '</p>'
      )
    })

    var paceChart = new Trackman.Charts.LineChart({
      el:      '#pace',
      data:    run.getPaces().slice(7),
      height:  250 - margin.top - margin.bottom,
      width:   650 - margin.left - margin.right,
      margins: margin,
      pointRadius: 3,
      yCount: 3,
      xCount: 5,
      yFormat: function(d) {
        var min = Math.floor(d / 60),
            sec = Math.floor(d % 60)

        return d3.time.format('%M:%S')(new Date(2012, 0, 1, 0, min, sec))
      },
      xAxisLabel: 'Miles',
      xAxisLabelPosition: '-5',
      yAxisLabel: 'Pace'
    })

    paceChart.render()

    Trackman.Tooltip.listenTo('#pace .point', function(datum) {
      var data = datum.dataset,
          time = moment.utc(Number(data.y) * 1000).format('mm:ss'),
          mile = Number(data.x).toFixed(2)

      return (
        '<p style="color: #444; font-size: 1em;">' +
          '<strong>Distance: </strong>' + mile + ' miles<br/>' +
          '<strong>Pace: </strong>' + time + ' min/mi' +
        '</p>'
      )
    })
  })
}()
