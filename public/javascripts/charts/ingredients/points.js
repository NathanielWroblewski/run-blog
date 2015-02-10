namespace('Trackman.Charts.Ingredients')

Trackman.Charts.Ingredients.Points = function(config) {
  this.data = config.data,
  this.xscale = config.xscale,
  this.yscale = config.yscale,
  this.el = config.el,
  this.radius = config.radius,

  this.render = function() {
    this.data.forEach(function(datum, index) {
      this.el.append('circle')
        .attr('class', 'point')
        .attr('data-x', datum.x)
        .attr('data-y', datum.y)
        .attr('cx', this.xscale(datum.x))
        .attr('cy', this.yscale(datum.y))
        .attr('r', this.radius)
    }.bind(this))
  }
}
