var resolved = require('./resolved')
var rejected = require('./rejected')
var deferred = require('./deferred')

var adapter = module.exports = {
	resolved: resolved,
	rejected: rejected,
	deferred: deferred
}
