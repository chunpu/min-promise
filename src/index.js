var _ = require('min-util')
var Promise = require('./promise')

// add helper
// caught is es3 usage like bluebird
Promise.prototype['catch'] = Promise.prototype.caught = function(onRejected) {
	return this.then(_.noop, onRejected)
}

module.exports = Promise