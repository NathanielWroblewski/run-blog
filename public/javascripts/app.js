!function() {

  function App() {
    var TEMPLATE_PATH = '/public/templates/',
        JS_PATH = '/public/javascripts/templates/'

    this.el = document.getElementById('content'),

    this.fetch = function(id) {
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          this.render(xhr.response)
          this.script(id)
        }
      }.bind(this)

      xhr.open('GET', TEMPLATE_PATH + id + '.html')
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
    }
  }

  new App().fetch('0001')
}()
