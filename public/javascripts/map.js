namespace('Trackman')

Trackman.Map = {

  render: function(latitude, longitude, id, zoom, geojson) {
    var location = new google.maps.LatLng(latitude, longitude)
      , mapOptions = { zoom: zoom, center: location }
      , map = new google.maps.Map(document.getElementById('map'), mapOptions)

    if (geojson) {
      var runData = this._geojsonURL(id)
      map.data.loadGeoJson(runData)
      map.data.setStyle({ fillColor: 'steelblue', strokeColor: 'steelblue' })
    } else {
      var runData = this._kmlURL(id)
        , run = new google.maps.KmlLayer({ url: runData })

      run.setMap(map)
    }

    map.setOptions({ styles: this._styles })
  },

  _kmlURL: function(id) {
    return 'https://raw.githubusercontent.com/NathanielWroblewski/kml-runs/' +
      'master/' + id + '.kml'
  },

  _geojsonURL: function(id) {
    return 'https://trackman.s3.amazonaws.com/geojson/' + id + '.json';
  },

  _styles: [
    {featureType: 'landscape',stylers: [{color: '#FCFAF8'},{visibility: 'on'}]},
    {featureType: 'poi', stylers: [{color: '#FCFAF8'},{visibility: 'simplified'}]},
    {featureType: 'road.highway', stylers:
      [{saturation: -100}, {visibility: 'simplified'}]
    },
    {featureType: 'road.arterial', stylers:
      [{saturation: -100}, {lightness: 30}, {visibility: 'on'}]
    },
    {featureType: 'road.local', stylers:
      [{saturation: -100}, {lightness: 40}, {visibility: 'on'}]
    },
    {featureType: 'transit', stylers: [{visibility: 'simplified'}]},
    {featureType: 'administrative.province', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'labels', stylers:
      [{visibility: 'on'}, {lightness: -25}, {saturation: -100}]
    },
    {featureType: 'water', elementType: 'geometry', stylers:
      [{color: '#aaaaaa'}]
    }
  ]
}
