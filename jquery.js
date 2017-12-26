var Promise = require('./src')
var Deferred = require('./src/jquerydeferred')

exports.when = function() {
	var deferred = new Deferred()
	// deferred.promise().spread = true
	var promises = arguments // deferred is promise too
	var promise = Promise.all(promises)
	promise.then(function(values) {
		// deferred.resolve(values)
		deferred.resolve.apply(null, values)
	}).caught(function(err) {
		deferred.reject(err)
	})
	return deferred
}

exports.Deferred = function() {
	return new Deferred()
}