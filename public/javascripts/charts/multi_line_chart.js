namespace('Trackman.Charts')

Trackman.Charts.MultiLineChart = function(config) {
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
  this.series = config.series,
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

  this.combineData = function() {
    return this.data.reduce(function(d1, d2){ return d1.concat(d2) },[])
  },

  this.childrenConfig = {
    el:      this.svg,
    width:   this.width,
    height:  this.height,
    data:    this.combineData(),
    xFormat: this.xFormat,
    yFormat: this.yFormat,
    xCount:  this.xCount,
    yCount:  this.yCount,
    xAxisLabelPosition: this.xAxisLabelPosition
  },

  this.x = new Trackman.Charts.Ingredients.LinearX(this.childrenConfig),
  this.y = new Trackman.Charts.Ingredients.LinearY(this.childrenConfig),

  this.render = function(attrs) {
    this.x.render(this.xAxisLabel)
    this.y.render(this.yAxisLabel)
    this.data.forEach(function(dataset, index){
      var line = new Trackman.Charts.Ingredients.Line({
        el:     this.svg.append('g').attr('class', this.series[index] + ' lines'),
        data:   dataset,
        xscale: this.x.getScale(),
        yscale: this.y.getScale()
      })

      var points = new Trackman.Charts.Ingredients.Points({
        el: this.svg.append('g').attr('class', this.series[index] + ' points'),
        data: dataset,
        xscale: this.x.getScale(),
        yscale: this.y.getScale(),
        radius: this.radius
      })

      line.render()
      points.render()
    }, this)
  }
}
