var _ = require('min-util')
var Promise = require('./promise')
Promise.resolve = require('./resolved')
Promise.reject = require('./rejected')

// add helper
// caught is es3 usage like bluebird
Promise.prototype['catch'] = Promise.prototype.caught = function(onRejected) {
	return this.then(null, onRejected)
}

Promise.all = function(promises) {
	var values = []
	var size = _.size(promises)
	var count = 0
	return new Promise(function(resolve, reject) {
		_.each(promises, function(promise, i) {
			Promise.resolve(promise).then(function(val) {
				values[i] = val
				count++
				if (count === size) {
					reject(values)
				}
			}, function(reason) {
				reject(reason)
			})
		})
	})
}

Promise.race = function(promises) {
	return new Promise(function(resolve, reject) {
		_.each(promises, function(promise) {
			Promise.resolve(promise).then(function(val) {
				resolve(val)
			}, function(reason) {
				reject(reason)
			})
		})
	})
}

module.exports = Promise