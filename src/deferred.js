// promise/A+ test
var Promise = require('./promise')

module.exports = function() {
  var ret = {}
  ret.promise = new Promise(function(resolve, reject) {
    ret.resolve = resolve
    ret.reject = reject
  })
  return ret
}
