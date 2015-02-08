namespace('Trackman.Charts')

Trackman.Charts.LineChart = function(config) {
  this.el      = d3.select(config.el),
  this.data    = config.data,
  this.height  = config.height,
  this.width   = config.width,
  this.margins = config.margins,

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
    el:     this.svg,
    width:  this.width,
    height: this.height,
    data:   this.data
  },

  this.x = new Trackman.Charts.Ingredients.LinearX(this.childrenConfig),
  this.y = new Trackman.Charts.Ingredients.LinearY(this.childrenConfig),

  this.line = new Trackman.Charts.Ingredients.Line({
    el:     this.svg,
    data:   this.data,
    xscale: this.x.getScale(),
    yscale: this.y.getScale()
  })

  this.render = function(attrs) {
    this.x.render()
    this.y.render()
    this.line.render()
  }
}
