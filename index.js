// Reference Document
// MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
// v8 https://github.com/v8/v8/blob/f0c9cc0bbfd461c7f516799d9a58e9a7395f737e/src/promise.js
// Spec: http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects

var _ = require('min-util')

var is = _.is

// 25.4.6 Properties of Promise Instances

// key
var PromiseState = 'PromiseState'
var PromiseResult = 'PromiseResult'

// promise state
var pending = 0
var fulfilled = 1
var rejected = -1

// promise list
var PromiseFulfillReactions = 'PromiseFulfillReactions' // fulfill list
var PromiseRejectReactions = 'PromiseRejectReactions' // reject list

module.exports = Promise

// state
// pending => resolve|reject => then => return => pending => then

function Promise(executor) {
	// 25.4.3.1
	if (!is.fn(executor)) {
		throw new TypeError('resolver is not function')
	}
	var me = this
	me[PromiseState] = pending
	me[PromiseFulfillReactions] = []
	me[PromiseRejectReactions] = []
}

var proto = Promise.prototype

proto.then = function(onFulfilled, onRejected) {
	// 25.4.5.3
	var me = this
	var state = me[PromiseState]
	if (pending == state) {
		me[PromiseFulfillReactions].push(onFulfilled)
		me[PromiseRejectReactions].push(onRejected)
	} else if (fulfilled == state) {
		EnqueueJob(onFulfilled, fulfilled)
	} else if (rejected == state) {
		EnqueueJob(onRejected, rejected)
	}
	return new Promise(me)
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
