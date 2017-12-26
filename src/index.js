var _ = require('min-util')
var Promise = require('./promise')
Promise.resolve = require('./resolved')
Promise.reject = require('./rejected')

// add helper
// caught is es3 usage like bluebird
Promise.prototype['catch'] = Promise.prototype.caught = function(onRejected) {
	return this.then(null, onRejected)
}

// delay tool function
Promise.prototype.delay = function(ms) {
	var val
	return this.then(function(value) {
		val = value
		return Promise.delay(ms)
	}).then(function() {
		return val
	})
}

Promise.delay = function(ms) {
	return new Promise(function(resolve) {
		setTimeout(resolve, ms)
	})
}

Promise.all = function(promises) {
	var values = []
	var size = _.size(promises)
	var count = 0
	return new Promise(function(resolve, reject) {
		if (size === 0) {
			resolve(values)
		}
		_.each(promises, function(promise, i) {
			Promise.resolve(promise).then(function(val) {
				values[i] = val
				count++
				if (count === size) {
					resolve(values)
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