!function() {
  Trackman.Map.render(29.669539000,-98.109142000,'0002',16)

  var secondPace = new Trackman.Models.PaceConverter({id: '0002'})
  secondPace.fetch(function() {
    var firstPace = new Trackman.Models.PaceConverter({id: '0001'})
    firstPace.fetch(function() {
      var margin = {top: 20, right: 10, bottom: 30, left: 40}

      var improvementChart = new Trackman.Charts.MultiLineChart({
        el:      '#improvement',
        data:    [firstPace.getPaces().slice(16), secondPace.getPaces().slice(10)],
        height:  300 - margin.top - margin.bottom,
        width: 650 - margin.left - margin.right,
        margins: margin,
        pointRadius: 3,
        yCount: 6,
        series: ['first-run', 'second-run'],
        yFormat: function(d) {
          var min = Math.floor(d / 60),
              sec = Math.floor(d % 60)

          return d3.time.format('%M:%S')(new Date(2012, 0, 1, 0, min, sec))
       }
      })

      improvementChart.render()

      Trackman.Tooltip.listenTo('#improvement .point', function(datum) {
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
  })
}()
