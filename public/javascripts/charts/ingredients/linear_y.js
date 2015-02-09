namespace('Trackman.Charts.Ingredients')

Trackman.Charts.Ingredients.LinearY = function(config) {
  this.height = config.height,
  this.width = config.width,
  this.data = config.data,
  this.el = config.el,
  this.yFormat = config.yFormat,
  this.yCount = config.yCount,

  this.getScale = function() {
    return (
      d3.scale.linear()
        .range([this.height, 0])
        .domain(d3.extent(this.data, function(datum) { return datum.y }))
    )
  },

  this.getAxis = function() {
    return d3.svg.axis().scale(this.getScale()).orient('left')
      .tickFormat(this.yFormat).ticks(this.yCount)
  },

  this.render = function(label) {
    this.el.append('g')
        .attr('class', 'y axis')
        .call(this.getAxis())
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text(label)
  }
}
