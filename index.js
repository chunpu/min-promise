// Reference Document
// MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// v8 https://github.com/v8/v8/blob/f0c9cc0bbfd461c7f516799d9a58e9a7395f737e/src/promise.js

var _ = require('min-util')

var is = _.is

// key
var PromiseStatus = 'PromiseStatus'
var PromiseValue = 'PromiseValue'
var rejected = 'rejected'
var resolved = 'resolved'
var pending = 'pending'

module.exports = Promise

function Promise(resolver) {
	if (!is.fn(resolver)) {
		throw new TypeError('resolver is not function')
	}
	var me = this
	me[PromiseStatus] = pending
	me[PromiseValue] = undefined
}

var proto = Promise.prototype

proto.then = function() {
	
}

proto['catch'] = function(onRejected) {
	// es3 like IE8- not support because catch is keyword
	return this.then(undefined, onRejected)
}

Promise.resolve = function(val) {
	return new Promise(function(val) {	
		resolve(val)
	})
}

Promise.reject = function(reason) {
	return new Promise(function(resolve, reject) {
		reject(reason)
	})
}

Promise.all = function() {
}

Promise.race = function() {
}

function isThenable(val) {
	return is.fn(_.get(val, 'then'))
}
