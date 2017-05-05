var _ = require('min-util')
var Promise = require('./promise')
Promise.resolve = require('./resolved')
Promise.reject = require('./rejected')

// add helper
// caught is es3 usage like bluebird
Promise.prototype['catch'] = Promise.prototype.caught = function(onRejected) {
	return this.then(null, onRejected)
}

module.exports = Promise