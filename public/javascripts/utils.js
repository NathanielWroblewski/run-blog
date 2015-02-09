namespace('Trackman')

Trackman.Utils = {
  /**
   * minToDate() parses a string into a date
   *
   * common formats:
   *   -  1:25   m:ss
   *   - 01:25  mm:ss
   *
   * @params <String> time
   * @params <String> format
   * @return <Date>
   */
  toDate: function(time, format) {
    return moment(time, format).toDate()
  },

  toRadians: function(number) {
    return number * Math.PI / 180
  },

  /**
   * haversine() returns the distance in miles between to latlong pairs
   *
   * @params <Array/Tuple> pair1
   * @params <Array/Tuple> pair2
   * @return <Number>
   */
  haversine: function(pair1, pair2) {
    var lat1 = pair1[0],
        lon1 = pair1[1],
        lat2 = pair2[0],
        lon2 = pair2[1],
        radius = 6378137.0, // earth radius in meter
        DE2RA = 0.01745329252; // degree to radian conversion

    if (lat1 == lat2 && lon1 == lon2) return 0;
    lat1 *= DE2RA;
    lon1 *= DE2RA;
    lat2 *= DE2RA;
    lon2 *= DE2RA;
    var d = Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2);
    return (radius * Math.acos(d)) * 0.000621371 // miles in a meter;
  },

  get: function(url, callback) {
    var request = new XMLHttpRequest();

    request.open('GET', url, true);

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        callback(request);
      }
    }

    request.send();
  }
}
