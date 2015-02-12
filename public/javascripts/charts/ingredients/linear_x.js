namespace('Trackman.Charts.Ingredients')

Trackman.Charts.Ingredients.LinearX = function(config) {
  this.height = config.height,
  this.width = config.width,
  this.data = config.data,
  this.el = config.el,
  this.xFormat = config.xFormat,
  this.xCount = config.xCount,
  this.labelPosition = config.xAxisLabelPosition,

  this.getScale = function() {
    return (
      d3.scale.linear()
        .range([0, this.width])
        .domain(d3.extent(this.data, function(datum) { return datum.x }))
    )
  },

  this.getAxis = function() {
    return d3.svg.axis().scale(this.getScale()).orient('bottom')
      .tickFormat(this.xFormat).ticks(this.xCount)
  },

  this.render = function(label) {
    this.el.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.getAxis())
      .append('text')
        .attr('x', this.width)
        .attr('y', this.labelPosition || '10')
        .style('text-anchor', 'end')
        .text(label)
  }
}
