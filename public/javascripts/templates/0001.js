!function() {
  var margin = {top: 20, right: 40, bottom: 30, left: 40}
      height = 200,
      width = 650

  var formatTime = d3.time.format('%-H:%M'),
      formatMinutes = function(d) { return formatTime(d); };
      formatRunTime = function(d) {
        return moment(d, 'm:ss').toDate()
      }

  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width - margin.right - margin.left], .5);

  var x1 = d3.scale.ordinal();

  var y = d3.time.scale()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient('bottom');

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickFormat(formatMinutes)
    .ticks(5);

  var svg = d3.select('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var barData = [
    {mile: 1, goalLap: '8:00', currentLap: '11:19', current: '11:19', goal: '8:00'},
    {mile: 2, goalLap: '8:00', currentLap: '11:06', current: '22:25', goal: '16:00'},
    {mile: 3, goalLap: '8:00', currentLap: '10:59', current: '33:24', goal: '24:00'},
    {mile: 4, goalLap: '8:00', currentLap: '10:56', current: '44:20', goal: '32:00'},
    {mile: 5, goalLap: '8:00', currentLap: '10:47', current: '55:07', goal: '40:00'}
  ]

  x0.domain(barData.map(function(d) { return d.mile; }));
  x1.domain(['goal', 'current']).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([formatRunTime('0:00'), formatRunTime('60:00')]);

  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
    .append('text')
      .attr('x', width - margin.right - margin.left - 5)
      .attr('y', '10')
      .style('text-anchor', 'end')
      .text('Mile');

  svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Time');

  barData.forEach(function(datum, i) {
    d3.range(datum.mile).forEach(function(lap) {
      ['current', 'goal'].forEach(function(series) {
        svg.append('rect')
           .attr('class', series)
           .attr('width', x1.rangeBand() - 8)
           .attr('x', function(d) { return x1(series) })
           .attr('y', height)
           .attr('transform', function(d) {
            return 'translate(' + (x0(datum.mile) + 4) + ',0)'
           })
           .attr('height', '0')
           .attr('data-mile', function(d) { return barData[lap].mile})
           .attr('data-lap', function(d) { return barData[lap][series + 'Lap']})
           .attr('data-cumulative', function(d) { return datum[series] })
           .transition().duration(200).delay((i * i + lap) * 200)
           .attr('height', function(d) {
            return height - y(formatRunTime(barData[lap][series + 'Lap']));
           })
           .attr('y', function(d) {
             return y(formatRunTime(barData[lap][series]));
           })
      })
    })
  })

  d3.selectAll('rect').on('mouseenter', function() {
    d3.select(this).attr('opacity', 0.7)
  })
  d3.selectAll('rect').on('mouseleave', function() {
    d3.select(this).attr('opacity', 1.0)
  })

  var tooltipTemplate = function(datum) {
    var data = datum.dataset

    return (
      '<p style="color: #444; font-size: 1em;">' +
        '<strong>Mile: </strong>' + data.mile + '<br/>' +
        '<strong>Lap: </strong>' + data.lap + '<br/>' +
        '<strong>Split: </strong>' + data.cumulative +
      '</p>'
    )
  }

  Trackman.Tooltip.listenTo('rect', tooltipTemplate)

  Trackman.Map.render(29.671642,-98.082013,'0001',16)

  var pace = new Trackman.Models.PaceConverter({id: '0001'})

  pace.fetch(function() {
    var lineChart = new Trackman.Charts.LineChart({
      el:      '#pace',
      data:    pace.getPaces().slice(16, pace.getPaces().length - 10),
      height:  150 - margin.top - margin.bottom,
      width: 650 - margin.left - margin.right,
      margins: {top: 20, right: 10, bottom: 30, left: 40},
      pointRadius: 3,
      yCount: 3,
      yFormat: function(d) {
        var min = Math.floor(d / 60),
            sec = Math.floor(d % 60)

        return d3.time.format('%M:%S')(new Date(2012, 0, 1, 0, min, sec))
      },
      xAxisLabel: 'Miles',
      yAxisLabel: 'Pace'
    })

    lineChart.render()

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

    var elevationChart = new Trackman.Charts.LineChart({
      el:      '#elevation',
      data:    pace.getElevations(),
      height:  100 - margin.top - margin.bottom,
      width: 650 - margin.left - margin.right,
      margins: margin,
      pointRadius: 3,
      yCount: 3,
      yFormat: function(d) { return d },
      yAxisLabel: 'Feet'
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
}()

