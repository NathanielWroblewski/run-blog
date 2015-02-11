!function() {
  namespace('Trackman')

  Trackman.latestPost = 3,
  Trackman.currentPost = Trackman.latestPost,

  Trackman.App = function() {
    var TEMPLATE_PATH = '/run-blog/public/templates/',
        JS_PATH = '/run-blog/public/javascripts/templates/'

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
  Trackman.app.fetch(Trackman.latestPost)

  // navigation
  d3.select('nav .first').on('click', function() {
    d3.event.preventDefault()
    Trackman.currentPost = 1
    window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
    Trackman.app.fetch(Trackman.currentPost)
  })

  d3.select('nav .back').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost - 1 >= 1) {
      Trackman.currentPost -= 1
      window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
      Trackman.app.fetch(Trackman.currentPost)
    }
  })

  d3.select('nav .next').on('click', function() {
    d3.event.preventDefault()
    if (Trackman.currentPost + 1 <= Trackman.latestPost) {
      Trackman.currentPost += 1
      window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
      Trackman.app.fetch(Trackman.currentPost)
    }
  })

  d3.select('nav .last').on('click', function() {
    d3.event.preventDefault()
    Trackman.currentPost = Trackman.latestPost
    window.location = '#' + Trackman.app._stringify(Trackman.currentPost)
    Trackman.app.fetch(Trackman.currentPost)
  })
}()
