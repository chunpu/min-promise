// jQuery $.Deferred $.when
var Promise = require('./promise')

module.exports = Deferred

function Deferred() {
  var me = this
  me._promise = new Promise(function(resolve, reject) {
    me.resolve = function() {
      resolve(arguments)
    }
    me.reject = function() {
      reject(arguments)
    }
  })
  me._promise.spread = true
}

var proto = Deferred.prototype

proto.promise = function() {
  return this._promise
}

proto.done = proto.then = function(handler) {
  return this._promise.then(handler)
}

proto.fail = proto.caught = proto['catch'] = function(handler) {
  return this._promise.caught(handler)
}

proto.always = function(handler) {
  return this._promise.then(handler, handler)
}
