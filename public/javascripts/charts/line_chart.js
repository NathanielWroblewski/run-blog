namespace('Trackman.Charts')

Trackman.Charts.LineChart = function(config) {
  this.el      = d3.select(config.el),
  this.data    = config.data,
  this.height  = config.height,
  this.width   = config.width,
  this.margins = config.margins,
  this.xFormat = config.xFormat,
  this.yFormat = config.yFormat,
  this.xCount = config.xCount,
  this.yCount = config.yCount,
  this.radius = config.pointRadius,
  this.xAxisLabel = config.xAxisLabel,
  this.yAxisLabel = config.yAxisLabel,
  this.xAxisLabelPosition = config.xAxisLabelPosition,

  this.getSVG = function() {
    return(
      this.el.append('svg')
            .attr('width', this.width + this.margins.left + this.margins.right)
            .attr('height', this.height + this.margins.top + this.margins.bottom)
          .append('g')
            .attr('transform', 'translate(' +
               this.margins.left + ',' + this.margins.top + ')'
            )
    )
  },

  this.svg = this.getSVG(),

  this.childrenConfig = {
    el:      this.svg,
    width:   this.width,
    height:  this.height,
    data:    this.data,
    xFormat: this.xFormat,
    yFormat: this.yFormat,
    xCount:  this.xCount,
    yCount:  this.yCount,
    xAxisLabelPosition: this.xAxisLabelPosition
  },

  this.x = new Trackman.Charts.Ingredients.LinearX(this.childrenConfig),
  this.y = new Trackman.Charts.Ingredients.LinearY(this.childrenConfig),

  this.line = new Trackman.Charts.Ingredients.Line({
    el:     this.svg,
    data:   this.data,
    xscale: this.x.getScale(),
    yscale: this.y.getScale()
  }),

  this.points = new Trackman.Charts.Ingredients.Points({
    el: this.svg,
    data: this.data,
    xscale: this.x.getScale(),
    yscale: this.y.getScale(),
    radius: this.radius
  }),

  this.animate = function() {
    var totalLength = this.el.select('.line')[0][0].getTotalLength()

    this.el.select('.line')
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition().duration(4000).ease('linear')
      .attr('stroke-dashoffset', 0);
  },

  this.render = function(attrs) {
    this.x.render(this.xAxisLabel)
    this.y.render(this.yAxisLabel)
    this.line.render()
    this.points.render()
    this.animate()
  }
}
