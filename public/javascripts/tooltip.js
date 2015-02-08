namespace('Trackman')

Trackman.Tooltip = {

  tooltip: d3.select('.tooltip-container'),

  listenTo: function(selector, template) {
    d3.selectAll(selector).on('mousemove.tooltip', this._moveTooltip.bind(this))
    d3.selectAll(selector).on('mouseleave.tooltip', this._hideTooltip.bind(this))
    d3.selectAll(selector).on('mouseenter.tooltip', function(datum) {
      this._showTooltip(template(datum || event.target))
    }.bind(this))
  },

  _moveTooltip: function() {
    this.tooltip
        .style('top',  (event.pageY - 35) + 'px')
        .style('left', (event.pageX + 30) + 'px')
  },

  _showTooltip: function(template) {
    this.tooltip
        .style('visibility', 'visible')
      .select('.tooltip')
        .html(template)
  },

  _hideTooltip: function() {
    this.tooltip.style('visibility', 'hidden')
  }
}
