var Promise = require('./')

module.exports = function(value) {
	return new Promise(function(resolve, reject) {
		resolve(value)
	})
}