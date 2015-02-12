!function() {
  Trackman.Map.render(29.669539000,-98.109142000,'0003',16)

  var firstPace = new Trackman.Models.PaceConverter({id: '0001'})
  firstPace.fetch(function() {
    var secondPace = new Trackman.Models.PaceConverter({id: '0002'})
    secondPace.fetch(function() {
      var thirdPace = new Trackman.Models.PaceConverter({id: '0003'})
      thirdPace.fetch(function() {
        var margin = {top: 20, right: 10, bottom: 30, left: 40}

        var improvementChart = new Trackman.Charts.MultiLineChart({
          el:      '#pace',
          data:    [
            firstPace.getPaces().slice(16),
            secondPace.getPaces().slice(10),
            thirdPace.getPaces().slice(5)
          ],
          height:  300 - margin.top - margin.bottom,
          width: 650 - margin.left - margin.right,
          margins: margin,
          pointRadius: 3,
          yCount: 6,
          series: ['first-run', 'second-run', 'third-run'],
          yFormat: function(d) {
            var min = Math.floor(d / 60),
                sec = Math.floor(d % 60)

            return d3.time.format('%M:%S')(new Date(2012, 0, 1, 0, min, sec))
         },
         xAxisLabel: 'Miles',
         xAxisLabelPosition: '-5'
        })

        improvementChart.render()

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

        var comparisonChart = new Trackman.Charts.MultiAxisMultiLineChart({
          el:      '#comparison',
          data:    [
            firstPace.getSpeeds().slice(16),
            secondPace.getSpeeds().slice(10),
            thirdPace.getSpeeds().slice(5)
          ],
          height:  300 - margin.top - margin.bottom,
          width: 650 - margin.left - margin.right,
          margins: margin,
          pointRadius: 3,
          yCount: 6,
          series: ['first-run', 'second-run', 'third-run'],
          yFormat: function(d) {
            return d
         },
         xAxisLabel: 'Miles',
         xAxisLabelPosition: '-5'
        })

        comparisonChart.render()

        Trackman.Tooltip.listenTo('#comparison .point', function(datum) {
          var data = datum.dataset,
              speed = Number(data.y).toFixed(2),
              mile = Number(data.x).toFixed(2)

          return (
            '<p style="color: #444; font-size: 1em;">' +
              '<strong>Distance: </strong>' + mile + ' miles<br/>' +
              '<strong>Speed: </strong>' + speed + ' mph' +
            '</p>'
          )
        })

        var elevationChart = new Trackman.Charts.LineChart({
          el:      '#elevation',
          data:    thirdPace.getElevations(),
          height:  100 - margin.top - margin.bottom,
          width: 650 - margin.left - margin.right,
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
      })
    })
  })
}()
