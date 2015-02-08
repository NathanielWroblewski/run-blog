namespace('Trackman.Charts.Ingredients')

Trackman.Charts.Ingredients.Line = function(config) {
  this.data = config.data,
  this.xscale = config.xscale,
  this.yscale = config.yscale,
  this.el = config.el,

  this.getLine = function() {
    return (
      d3.svg.line()
        .x(function(datum) { return this.xscale(datum.x) }.bind(this))
        .y(function(datum) { return this.yscale(datum.y) }.bind(this))
    )
  },

  this.render = function() {
    this.el.append('path')
        .datum(this.data)
        .attr('class', 'line')
        .attr('d', this.getLine())
  }
}
