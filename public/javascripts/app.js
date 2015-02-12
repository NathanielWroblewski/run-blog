!function() {
  namespace('Trackman')

  Trackman.latestPost = 4,
  Trackman.currentPost = Trackman.latestPost,

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
    }
  }

  Trackman.app = new Trackman.App()

  // navigate to post base on id in the url, i.e. /#0001
  var postId = parseInt(window.location.hash.replace('#', ''))
  if (!isNaN(postId) && postId > 0 && postId < Trackman.latestPost) {
    Trackman.currentPost = postId
    Trackman.app.fetch(Trackman.currentPost)
  } else {
    Trackman.app.fetch(Trackman.latestPost)
  }

  // navigation
  d3.select('nav .nav-first').on('click', function() {
    d3.event.preventDefault()
    Trackman.currentPost = 1
    window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
    Trackman.app.fetch(Trackman.currentPost)
  })

  d3.select('nav .nav-back').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost - 1 >= 1) {
      Trackman.currentPost -= 1
      window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
      Trackman.app.fetch(Trackman.currentPost)
    }
  })

  d3.select('nav .nav-next').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost + 1 <= Trackman.latestPost) {
      Trackman.currentPost += 1
      window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
      Trackman.app.fetch(Trackman.currentPost)
    }
  })

  d3.select('nav .nav-last').on('click', function() {
    d3.event.preventDefault()
    Trackman.currentPost = Trackman.latestPost
    window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
    Trackman.app.fetch(Trackman.currentPost)
  })
}()
