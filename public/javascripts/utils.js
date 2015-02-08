namespace('trackman')

trackman.utils = {
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
  toDate = function(time, format) {
    return moment(time, format).toDate()
  }
}
