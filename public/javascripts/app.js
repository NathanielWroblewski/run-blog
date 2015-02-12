!function() {
  namespace('Trackman')

  Trackman.latestPost = 4

  Trackman.App = function() {
    var TEMPLATE_PATH = '/public/templates/',
        JS_PATH = '/public/javascripts/templates/'

    this.el = document.getElementById('content'),

    this.fetch = function(id) {
      var xhr = new XMLHttpRequest()
          paddedId = this._stringify(id);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          this.render(xhr.response)
          this.script(paddedId)
        }
      }.bind(this)

      xhr.open('GET', TEMPLATE_PATH + paddedId + '.html')
      xhr.send()
    },

    this.script = function(id) {
      script = document.createElement('script')

      script.type = 'text/javascript'
      script.async = true
      script.src = JS_PATH + id + '.js'
      this.el.appendChild(script)
    },

    this.render = function(template) {
      this.el.innerHTML = template
      return this
    },

    this.navigate = function(id) {
      Trackman.currentPost = id
      window.location = '#' + this._stringify(Trackman.currentPost)
      this.fetch(Trackman.currentPost)
      this._setActiveNavigation()
    },

    this._stringify = function(id){
      return this._zeropad(id, 4)
    },

    this._zeropad = function(number, width) {
      number = number + ''

      if (number.length >= width) {
        return number
      } else {
        return new Array(width - number.length + 1).join('0') + number
      }
    },

    this._setActiveNavigation = function() {
      d3.selectAll('nav a').attr('class', '')

      if (Trackman.currentPost === Trackman.latestPost) {
        d3.select('#nav-next').attr('class', 'inactive')
        d3.select('#nav-last').attr('class', 'inactive')
      }
      if (Trackman.currentPost === 1) {
        d3.select('#nav-first').attr('class', 'inactive')
        d3.select('#nav-back').attr('class', 'inactive')
      }
    }
  }

  Trackman.app = new Trackman.App()

  // navigate to post base on id in the url, i.e. /#0001
  var postId = parseInt(window.location.hash.replace('#', ''))
  if (!isNaN(postId) && postId > 0 && postId < Trackman.latestPost) {
    Trackman.app.navigate(postId)
  } else {
    Trackman.app.navigate(Trackman.latestPost)
  }

  // site navigation via the << < > >> arrows
  d3.select('#nav-first').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost > 1) Trackman.app.navigate(1)
  })

  d3.select('#nav-back').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost > 1) Trackman.app.navigate(Trackman.currentPost - 1)
  })

  d3.select('#nav-next').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost < Trackman.latestPost) {
      Trackman.app.navigate(Trackman.currentPost + 1)
    }
  })

  d3.select('#nav-last').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost < Trackman.latestPost) {
      Trackman.app.navigate(Trackman.latestPost)
    }
  })
}()
